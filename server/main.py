import threading
from datetime import datetime, timedelta
import logging
from logging.handlers import TimedRotatingFileHandler
import os
import schedule
import time

import toml
from flask import Flask, jsonify, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from bin.blueprint.auth_bp import auth_bp
from bin.blueprint.authorized_slip_bp import authorized_slip_bp
from bin.blueprint.cbs_bp import cbs_bp
from bin.blueprint.dispute_bp import dispute_report_bp
from bin.blueprint.reports.report import report_bp
from bin.blueprint.user_bp import user_bp
from bin.database.db import database
from bin.middleware.jwt_middleware import jwt_middleware
from bin.scheduleJob.misJob import misJob
from bin.sys.key_storage import retrieve_jwt_hash

app = Flask(__name__)

# Ensure the Log directory exists
log_directory = 'log'
os.makedirs(log_directory, exist_ok=True)

# Logging configuration for both Flask and Werkzeug
log_filename = os.path.join(
    log_directory, f"{datetime.now().strftime('%Y_%m_%d')}.log")
handler = TimedRotatingFileHandler(
    log_filename, when="midnight", backupCount=7)
handler.setLevel(logging.INFO)
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s'))

app.logger.addHandler(handler)  # Flask logger
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.addHandler(handler)  # Werkzeug logger

CORS(app, resources={r"*": {"origins": "*"}})
app.config['JWT_SECRET_KEY'] = retrieve_jwt_hash()[0]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
jwt = JWTManager(app)

with open('config.toml', 'r') as file:
    config = toml.load(file)

version = "0.1"


def handle_error(param):
    print(param)


@app.route('/', methods=['GET'])
def echo():
    return jsonify({
        "Name": "Arden",
        "Author": "Tanbin Hassan Bappi",
        "License": "Mozilla Public Licence",
        "Version": str(version)
    }), 200


# Apply middleware to specific blueprints
app.register_blueprint(report_bp, url_prefix='/api/v1/report')
app.register_blueprint(auth_bp, url_prefix='/api/v1/oauth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(cbs_bp, url_prefix='/api/v1/cbs')
app.register_blueprint(dispute_report_bp, url_prefix='/api/v1/dispute')
app.register_blueprint(authorized_slip_bp, url_prefix='/api/v1/card/activation/')

# Only apply middleware to the following blueprints
app = jwt_middleware(app, blueprints=[cbs_bp, user_bp, dispute_report_bp])


@app.route('/<path:unknown>', methods=['GET', 'POST'])
def handle_unknown_routes(unknown):
    abort(404)


@app.errorhandler(404)
def page_not_found():
    print("test")
    return jsonify({"error": "Page not found"}), 404


if __name__ == '__main__':
    # Init Database
    database()

    # Set up the scheduler
    scheduler = schedule.Scheduler()

    # Define a cron expression to run the job on the 2nd day of the month at midnight
    cron_expr = '0 0 2 * *'

    # Schedule the job using cron expression
    scheduler.every().day.at('00:00').do(misJob).tag('Generating MIS data.')


    # Start the scheduler in a separate thread
    def run_scheduler():
        while True:
            scheduler.run_pending()
            time.sleep(1)


    # Start the scheduler thread as a daemon
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    # Run the rest of your code
    # setup()
    # init_MIS_particular_data()
    # migFromAccess()
    # misJob()
    # digibanking('''SHOW GLOBAL VARIABLES LIKE 'PORT' ''')

    print("Active Schedules:")
    for job in scheduler.get_jobs():
        print(job)

    app.run(debug=True, host=config["server"]["host"], port=int(config["server"]["port"]))

    print("Application api listening at " + str(config["server"]["port"]) + " with allow port " + config["server"][
        "host"])

    print("To run console type python3 console.py")
