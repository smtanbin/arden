from flask import Blueprint, request, jsonify

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/databse/status', methods=['GET'])
def add_token():
    try:
        return jsonify({"databse": "test"}), 200

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@admin_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Admin Page not found"}), 404
