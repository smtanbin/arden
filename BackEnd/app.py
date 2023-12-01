
import toml
from flask import Flask, jsonify
from bin.blueprint.user import user_bp


app = Flask(__name__)
with open('config.toml', 'r') as file:
    config = toml.load(file)

version = "0.0"


def handle_error(param):
    print(param)


# app.static_folder = os.path.join(app.root_path, 'static')

app.register_blueprint(user_bp, url_prefix='/api/v1/users')


@app.route('/api/v1/about', methods=['GET'])
def echo():
    return jsonify({
        "Name": "Arden",
        "Author": "Tanbin Hassan Bappi",
        "License": "Mozilla Public Licence",
        "Version": str(version)
    }), 200


# This route is redundant, consider removing it

@app.errorhandler(404)
def page_not_found():
    print("test")
    return jsonify({"error": "Page not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, host=config["server"]
            ["host"], port=int(config["server"]["port"]))
    print("To run console type python3 console.py")
