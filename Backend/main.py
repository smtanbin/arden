import datetime

import toml
from flask import Flask, jsonify
from flask_cors import CORS

from bin.blueprint.reports.mis_report_bp import mis_report_bp
from bin.blueprint.dispute_report_bp import dispute_report_bp
from bin.blueprint.user_bp import user_bp
from bin.database.db import database

app = Flask(__name__)
CORS(app)
with open('config.toml', 'r') as file:
    config = toml.load(file)

version = "0.0"


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


# app.static_folder = os.path.join(app.root_path, 'static')

app.register_blueprint(user_bp, url_prefix='/api/v1/users')
# app.register_blueprint(authorized_slip_bp, url_prefix='/api/v1/authorized_slip')
app.register_blueprint(mis_report_bp, url_prefix='/api/v1/report/mis')
app.register_blueprint(dispute_report_bp, url_prefix='/api/v1/dispute')


@app.errorhandler(404)
def page_not_found():
    print("test")
    return jsonify({"error": "Page not found"}), 404


if __name__ == '__main__':
    print(datetime.date)
    database()  # Create tables and commit changes
    app.run(debug=True, host=config["server"]["host"], port=int(config["server"]["port"]))
    print("To run console type python3 console.py")
