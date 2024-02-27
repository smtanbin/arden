from flask import request, jsonify, Blueprint

from bin.database.models.ReportModels.MISRawDataModel import get_mis_data

report_bp = Blueprint('report_bp', __name__)


@report_bp.route('/mis', methods=['POST'])
def fun_mis():
    try:
        req = request.get_json()
        year = req.get("year")

        if year:
            data, error = get_mis_data(year)
            if error is None:
                return jsonify({"payload": data, "error": None})
            else:
                return jsonify({"payload": None, "error": error}), 500
        else:
            return jsonify({"payload": None, "error": "Year not provided"}), 400

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@report_bp.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404
