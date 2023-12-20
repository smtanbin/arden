from datetime import timedelta

import toml
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from bin.blueprint.auth_bp import auth_bp
from bin.blueprint.cbs_bp import cbs_bp
from bin.blueprint.dispute_bp import dispute_report_bp

from bin.blueprint.user_bp import user_bp
from bin.database.db import database
from bin.middleware.jwt_middleware import jwt_middleware
from bin.sys.key_storage import retrieve_jwt_hash

app = Flask(__name__)

CORS(app, resources={r"*": {"origins": "*"}})
app.config['JWT_SECRET_KEY'] = retrieve_jwt_hash()[0]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
jwt = JWTManager(app)

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


# Apply middleware to specific blueprints
app.register_blueprint(auth_bp, url_prefix='/api/v1/oauth')
app.register_blueprint(user_bp, url_prefix='/api/v1/users')
app.register_blueprint(cbs_bp, url_prefix='/api/v1/cbs')
app.register_blueprint(dispute_report_bp, url_prefix='/api/v1/dispute')

# Only apply middleware to the following blueprints
app = jwt_middleware(app, blueprints=[cbs_bp, user_bp, dispute_report_bp])


@app.errorhandler(404)
def page_not_found():
    print("test")
    return jsonify({"error": "Page not found"}), 404


if __name__ == '__main__':
    # setup()
    database()
    app.run(debug=True, host=config["server"]["host"], port=int(config["server"]["port"]))
    print("To run console type python3 console.py")
