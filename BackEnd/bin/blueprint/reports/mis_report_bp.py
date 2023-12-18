from flask import Blueprint, request, jsonify

from bin.api.mis.mis import generate_mis

mis_report_bp = Blueprint('mis_report_bp', __name__)


@mis_report_bp.route('/get', methods=['POST'])
def get_data_routes():
    try:
        req = request.get_json()

        res = generate_mis(int(req["year"]))
        return jsonify({"payload": res}), 200

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@mis_report_bp.errorhandler(404)
def admin_page_not_found(e):
    return jsonify({"error": "Admin Page not found"}), 404
