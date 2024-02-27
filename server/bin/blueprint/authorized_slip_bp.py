import base64

from flask import Blueprint, request, jsonify, abort

from bin.database.access_db import accessDB
from bin.database.cbs import cbs_query
from bin.database.db import database
from bin.database.models.CardActivation.CardActivation import CardActivationModel
from bin.database.models.Users.UserInfoModel import UserInfoModel

authorized_slip_bp = Blueprint('authorized_slip_bp', __name__)
session_maker = database()
session = session_maker()


@authorized_slip_bp.route('/add', methods=['POST'])
def create_card_activation():
    try:
        data = request.get_json()
        user_info = session.query(UserInfoModel).filter_by(email=data['username']).first()

        if user_info:

            attachment_bytes = base64.b64decode(data['attachment'].split(',')[1])
            print(attachment_bytes)

            card_activation = CardActivationModel(
                pan=data['pan'],
                acno=data['acno'],
                title=data['title'],
                contact=data['contact'],
                submitted_by=user_info,
                issue_branch_code=str(user_info.branch),
                org_branch_code=data['org_branch_code'],
                massage=data['massage'],
                attachment=attachment_bytes,
            )

            session.add(card_activation)
            session.commit()

            return jsonify({"tracking_id": card_activation.uuid, "error": None}), 201


        else:
            return jsonify({"tracking_id": None, "error": "User not found."}), 404
    except Exception as e:
        return jsonify({"tracking_id": None, "error": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()


@authorized_slip_bp.route('/branch_list/<username>', methods=['GET'])
def get_card_activations(username):
    try:
        user_info = session.query(UserInfoModel).filter_by(email=username).first()

        if user_info:
            card_activations = session.query(CardActivationModel).filter(
                (CardActivationModel.submitted_by == user_info.uuid) |
                (CardActivationModel.org_branch_code == user_info.branch) |
                (CardActivationModel.issue_branch_code == user_info.branch)
            ).all()

            serialized_activations = []
            for activation in card_activations:
                serialized_activation = {
                    "pan": activation.pan,
                    "acno": activation.acno,
                    "title": activation.title,
                    "contact": activation.contact,
                    "origin_date": activation.submitted_at,
                    "origin_by": activation.submitted_by,
                    "massage": activation.massage,
                    "submitted_at": activation.submitted_at,
                    "approved_at": activation.update_at,
                    "approved": activation.approved,
                    "rejected": activation.rejected,
                }
                serialized_activations.append(serialized_activation)

            return jsonify({"payload": serialized_activations, "error": None})
        else:
            return jsonify({"error": "User not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()


@authorized_slip_bp.route('/pending_list', methods=['GET'])
def pending_list():
    try:
        card_activations = session.query(CardActivationModel).filter_by(approved=None).all()

        serialized_activations = []
        for activation in card_activations:
            serialized_activation = {
                "pan": activation.pan,
                "acno": activation.acno,
                "title": activation.title,
                "contact": activation.contact,
                "origin_date": activation.submitted_at,
                "origin_by": activation.submitted_by,
                "origin_branch": activation.issue_branch_code,
                "massage": activation.massage,
                "attachment_data": activation.attachment,
                "submitted_at": activation.submitted_at
            }
            serialized_activations.append(serialized_activation)

        return jsonify({"payload": serialized_activations, "error": None})
    except Exception as e:
        print("/api/v1/card/activation/add ", e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()


@authorized_slip_bp.route('/get/<uuid>', methods=['GET'])
def get_data(uuid):
    try:
        card_activation = session.query(CardActivationModel).filter_by(uuid=uuid).first()

        if card_activation:
            serialized_activation = {
                "pan": card_activation.pan,
                "acno": card_activation.acno,
                "title": card_activation.title,
                "contact": card_activation.contact,
                "origin_date": card_activation.submitted_at,
                "origin_by": card_activation.submitted_by,
                "origin_branch": card_activation.issue_branch_code,
                "massage": card_activation.massage,
                "attachment_data": card_activation.attachment_data,
                "submitted_at": card_activation.submitted_at
            }

            return jsonify({"payload": serialized_activation, "error": None})
        else:
            return jsonify({"error": "Record not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()


@authorized_slip_bp.route('/account_info/<pan>', methods=['GET'])
def ac_info_by_pan(pan):
    try:
        ms_query = (f"select Acct_Number as acno from CPSStandardBank.dbo.account where pan='{pan}'")
        access_result_data = accessDB(ms_query)

        if not access_result_data:
            return jsonify({"data": None, "error": "No data found for the provided PAN"}), 404

        cquery = (
            f"SELECT B.ACTTIT AS title,B.BRANCD BRANCH, nvl(A.MOBLNO, A.TELENO)  AS PHONE FROM ISLBAS.STCUSMAS@CBS_HASAN A, "
            f"ISLBAS.STFACMAS@CBS_HASAN B WHERE A.CUSCOD = B.CUSCOD AND B.ACTNUM = '{access_result_data[0]['acno']}'")

        result_data = cbs_query(cquery)

        if not result_data:
            return jsonify({"data": None, "error": "No data found for the provided ACNO"}), 404

        data = {
            "title": result_data[0]['TITLE'],
            "branchc": result_data[0]['BRANCH'],
            "acno": access_result_data[0]['acno'],
            "contact": result_data[0]['PHONE']
        }

        return jsonify({"data": data, "error": None}), 200

    except Exception as e:
        print('account_info', e)
        return jsonify({"data": None, "error": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()


@authorized_slip_bp.route('/<path:unknown>', methods=['GET', 'POST'])
def handle_unknown_routes(unknown):
    abort(404)
