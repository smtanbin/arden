from flask import Blueprint, request, jsonify

from bin.database.models.ReportModels.MISRawDataModel import init_MIS_particular_data
from bin.scheduleJob.misJob import misJob

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/setup', methods=['GET'])
def setup():
    try:
        setup()
        return jsonify({"massage": "Success", "error": None}), 200

    except Exception as e:
        return jsonify({"massage": "Failed", "error": str(e)}), 200


@admin_bp.route('/flashMisParticular', methods=['GET'])
def flashMisParticular():
    try:
        init_MIS_particular_data()
        return jsonify({"massage": "Success", "error": None}), 200

    except Exception as e:
        return jsonify({"massage": "Failed", "error": str(e)}), 200


@admin_bp.route('/job/mis', methods=['GET'])
def run_mis():
    try:
        misJob()
        return jsonify({"massage": "Success", "error": None}), 200

    except Exception as e:
        return jsonify({"massage": "Failed", "error": str(e)}), 200


@admin_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Admin Page not found"}), 404
