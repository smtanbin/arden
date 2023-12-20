import base64
import logging
from io import BytesIO

from PIL import Image as PILImage
from flask import Blueprint, request, jsonify

from bin.api.DisputeManager import DisputeManager
from bin.database.db import database

logger = logging.getLogger(__name__)

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
                                      merchant_name, merchant_location, tr_amt, attachment_bytes)
        DisputeAttachment

        if dispute:
            return jsonify({"uuid": str(dispute), "error": None})
        else:
            return jsonify({"payload": None, "error": "Dispute not found"}), 404

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/get/<dispute_id>', methods=['GET'])
def get_data_route(dispute_id):
    try:
        if not dispute_id:
            return jsonify({"payload": None, "error": "Missing dispute_id in the request"}), 400

        dispute = dispute_manager.get(dispute_id)

        if dispute:
            # Exclude the 'attachment' field from the serialized dispute
            serialized_dispute = dispute.serialize()
            if 'attachment' in serialized_dispute:
                del serialized_dispute['attachment']

            return jsonify({"error": None, "payload": serialized_dispute})

        else:
            return jsonify({"payload": "Dispute not found", "error": None}), 404

    except Exception as e:
        print(e)
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/get_image/<dispute_id>', methods=['GET'])
def get_image_data_route(dispute_id):
    try:
        if not dispute_id:
            return jsonify({"payload": None, "error": "Missing dispute_id in the request"}), 400

        dispute_attachment = dispute_manager.get_image(dispute_id)

        if dispute_attachment:
            # Convert bytes to base64-encoded string
            attachment_base64 = base64.b64encode(dispute_attachment).decode('utf-8')
            return jsonify({"error": None, "attachment": attachment_base64})
        else:
            return jsonify({"attachment": None, "error": None}), 200

    except Exception as e:
        print(e)
        return jsonify({"payload": None, "error": str(e)}), 500


# @dispute_report_bp.route('/get/<dispute_id>', methods=['GET'])
# def get_data_route(dispute_id):
#     try:
#
#         if not dispute_id:
#             return jsonify({"payload": None, "error": "Missing dispute_id in the request"}), 400
#
#         dispute = dispute_manager.get(dispute_id)
#
#         if dispute:
#             # Assuming 'attachment' is a field in the dispute model containing base64-encoded image data
#             attachment_base64 = dispute.attachment
#
#             if attachment_base64:
#                 return jsonify({"error": None, "payload": {"dispute_data": dispute.serialize(),
#                                                            "attachment": attachment_base64.decode('utf-8')}})
#             else:
#                 return jsonify({"error": None, "payload": {"dispute_data": dispute.serialize(), "attachment": None}})
#
#         else:
#             return jsonify({"payload": "Dispute not found", "error": None}), 404
#
#     except Exception as e:
#         print(e)
#         return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/dispute_list', methods=['GET'])
def get_all_dispute_data():
    try:
        limit = request.args.get('limit', default=200, type=int)
        disputes = dispute_manager.get_all(limit)

        if disputes and disputes[0] is not None:
            serialized_disputes = []
            for dispute in disputes:
                serialized_dispute = dispute.serialize()
                # Convert bytes to base64-encoded string for serialization
                if 'attachment' in serialized_dispute and isinstance(serialized_dispute['attachment'], bytes):
                    serialized_dispute['attachment'] = base64.b64encode(serialized_dispute['attachment']).decode(
                        'utf-8')
                serialized_disputes.append(serialized_dispute)
            return jsonify({"payload": serialized_disputes, "error": None})
        else:
            return jsonify({"payload": [], "error": None}), 200


    except Exception as e:
        logger.exception("An unexpected error occurred")
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.route('/list_by_date', methods=['POST'])
def post_all_dispute_data():
    try:
        data = request.get_json()
        query = dispute_manager.data_between_date(data.get('from_date'), data.get('to_date'))

        # Execute the query to get the results
        disputes = query.all()

        if disputes and len(disputes) > 0:
            serialized_disputes = []
            for dispute in disputes:
                serialized_dispute = dispute.serialize()

                if 'attachment' in serialized_dispute and isinstance(serialized_dispute['attachment'], bytes):
                    serialized_dispute['attachment'] = base64.b64encode(serialized_dispute['attachment']).decode(
                        'utf-8')
                serialized_disputes.append(serialized_dispute)
            return jsonify({"payload": serialized_disputes, "error": None}), 200
        else:
            return jsonify({"payload": [], "error": None}), 200

    except ValueError as ve:
        return jsonify({"payload": None, "error": f"Invalid date format: {ve}"}), 400
    except Exception as e:
        logger.exception("An unexpected error occurred")
        return jsonify({"payload": None, "error": str(e)}), 500


@dispute_report_bp.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404
