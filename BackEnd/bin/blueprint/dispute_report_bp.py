import base64

from flask import Blueprint, request, jsonify

from bin.api.DisputeManager import DisputeManager
from bin.database.db import database

dispute_report_bp = Blueprint('dispute_report_bp', __name__)
session_maker = database()
session = session_maker()
dispute_manager = DisputeManager(session)


@dispute_report_bp.route('/add', methods=['POST'])
def add_dispute_route():
    try:
        req = request.get_json()
        print("______req data____", req)
        pan = req.get("pan")
        acno = req.get("acno")
        txn_date = req.get("txn_date")
        org_id = req.get("org_id")
        channel = req.get("channel")
        org_branch_code = req.get("org_branch_code")
        acquirer = req.get("acquirer")
        maker_user = req.get("maker_user")
        merchant_name = req.get("merchant_name")
        merchant_location = req.get("merchant_location")
        tr_amt = req.get("tr_amt")
        attachment = req.get("attachment")

        attachment_bytes = None
        if attachment:
            attachment_bytes = base64.b64decode(attachment.split(',')[1])

        dispute = dispute_manager.add(pan, acno, channel, txn_date, org_id, org_branch_code, acquirer, maker_user,
                                      merchant_name,
                                      merchant_location,
                                      tr_amt, attachment_bytes)

        if dispute:
            return jsonify({"uuid": str(dispute), "error": None})
        else:
            return jsonify({"payload": None, "error": "Dispute not found"}), 404

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/get', methods=['POST'])
def get_data_route():
    try:
        req = request.get_json()
        dispute_id = req.get("dispute_id")

        dispute = dispute_manager.get(dispute_id)

        if dispute:
            return jsonify({"payload": dispute.serialize()})  # Assuming Dispute model has a serialize method
        else:
            return jsonify({"payload": None, "error": "Dispute not found"}), 404

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/get', methods=['GET'])
def get_all_data_route():
    try:
        limit = request.args.get('limit', default=200, type=int)  # Set default limit to 200 if not provided
        disputes = dispute_manager.get_all(limit)

        if disputes:
            serialized_disputes = []

            for dispute in disputes:
                # Assuming dispute.serialize() returns a dictionary
                serialized_dispute = dispute.serialize()

                # Convert bytes values to strings or another serializable format
                for key, value in serialized_dispute.items():
                    if isinstance(value, bytes):
                        serialized_dispute[key] = value.decode('utf-8')  # Convert bytes to string

                serialized_disputes.append(serialized_dispute)

            return jsonify({"payload": serialized_disputes})
        else:
            return jsonify({"payload": None, "error": "No disputes found"}), 404

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500

# @dispute_report_bp.route('/get', methods=['GET'])
# def get_all_data_route():
#     try:
#         limit = request.args.get('limit', default=200, type=int)  # Set default limit to 200 if not provided
#         disputes = dispute_manager.get_all(limit)
#
#         if disputes:
#             serialized_disputes = [dispute.serialize() for dispute in disputes]
#             return jsonify({"payload": serialized_disputes})
#         else:
#             return jsonify({"payload": None, "error": "No disputes found"}), 404
#
#     except Exception as e:
#         return jsonify({"payload": None, "error": str(e)}), 500



@dispute_report_bp.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404
