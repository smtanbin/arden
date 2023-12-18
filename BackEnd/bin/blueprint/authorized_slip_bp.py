
from flask import Blueprint, request, jsonify

from bin.api.AuthorizedSlip import AuthorizedSlip

authorized_slip_bp = Blueprint('authorized_slip_bp', __name__)
authorizedObject = AuthorizedSlip()


@authorized_slip_bp.route('/add', methods=['POST'])
def add_data_routes():
    try:
        req = request.get_json()

        res = authorizedObject.add_data(req["acno"])
        return jsonify({"payload": res}), 200

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@authorized_slip_bp.errorhandler(404)
def admin_page_not_found(e):
    return jsonify({"error": "Admin Page not found"}), 404
