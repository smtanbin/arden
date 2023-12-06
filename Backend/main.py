
import toml
from flask import Flask, jsonify

# from bin.blueprint.authorized_slip_bp import authorized_slip_bp
from bin.blueprint.reports.mis_report_bp import mis_report_bp
from bin.blueprint.user_bp import user_bp


app = Flask(__name__)
with open('config.toml', 'r') as file:
    config = toml.load(file)

version = "0.0"


def handle_error(param):
    print(param)


# app.static_folder = os.path.join(app.root_path, 'static')

app.register_blueprint(user_bp, url_prefix='/api/v1/users')
# app.register_blueprint(authorized_slip_bp, url_prefix='/api/v1/authorized_slip')
app.register_blueprint(mis_report_bp, url_prefix='/api/v1/report/mis')


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
