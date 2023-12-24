# user_bp.py
import datetime

from bin.api.AuditManager import AuditModelManager
from bin.database.db import database
from bin.api.PasswordManager import PasswordManager

import random
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from bin.database.models.Users.UserInfoModel import UserInfoModel
from bin.mail.smtp import Sent_email

user_bp = Blueprint('user', __name__)
session_maker = database()
session = session_maker()
pm = PasswordManager()


@user_bp.route('/add', methods=['POST'])
def add_user():
    try:
        data = request.get_json()

        if all(data.get(field) for field in ['firstName', 'lastName', 'email', 'contact', 'permissions']):
            otp = str(random.randint(1111, 9999))

            new_user = UserInfoModel(
                userid=data['userid'],
                firstName=data['firstName'],
                lastName=data['lastName'],
                status=True,
                lock=False,
                email=data['email'],
                contact=data['contact'],
                password_hash=pm.set_password(data['email'], otp),
                otp=otp,
                permissions=data['permissions']
            )
            session.add(new_user)
            session.commit()

            audit_manager = AuditModelManager(session)
            audit_manager.log(str(data['email']), "User added successfully")

            return jsonify({'message': 'User added successfully.'})
        else:
            return jsonify({'error': 'mandatory parameter not found', 'message': None}), 400

    except IntegrityError as e:
        # Handle duplicate email entry error
        session.rollback()
        return jsonify({'error': 'Duplicate username. User with this email already exists.'}), 400
    except Exception as e:
        session.rollback()
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@user_bp.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data['username']
    old_password = data['old_password']
    new_password = data['new_password']

    if not username or not old_password or not new_password:
        return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400

    user = session.query(UserInfoModel).filter_by(email=username).first()

    if user:
        # Assuming 'password_hash' is the attribute in your User model
        password_hash = user.password_hash
        if PasswordManager.is_valid_password(username, password_hash, old_password):

            user.password_hash = PasswordManager.set_password(
                username, new_password)
            session.commit()

            return jsonify({'message': 'Password update successfully successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid password.'}), 401
    else:
        return jsonify({'message': 'User not found.'}), 404


@user_bp.route('/lock', methods=['POST'])
def lock_user():
    try:
        data = request.get_json()
        username = data['name']

        user = session.query(UserInfoModel).filter_by(email=username).first()
        if user:
            user.lock = True
            session.commit()
            return jsonify({'message': 'User locked successfully.'})
        else:
            return jsonify({'message': 'User not found.'}), 404
    except Exception as e:
        session.rollback()
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@user_bp.route('/pendingList', methods=['GET'])
def funPendingList():
    try:

        user_list = session.query(UserInfoModel).filter_by(status=False, reg_status=True).all()

        if len(user_list) != 0:
            users = [{'uuid': user.uuid, 'user_id': user.userid, 'username': user.email, 'firstName': user.firstName,
                      'lastName': user.lastName,
                      'phone': user.contact, 'reg_date': user.timestamp} for user in user_list]
            return jsonify({'payload': users, 'error': None}), 200
        else:
            return jsonify({'payload': None, 'error': 'no data found'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@user_bp.route('/pendingList/<uuid>', methods=['PUT'])
def approved_user(uuid):
    try:
        user = session.query(UserInfoModel).filter_by(uuid=uuid).first()
        if user:
            Sent_email(user.email, 'Account Approved', f'Congress your account has been approved. Your Temporary '
                                                       f'password is {user.otp}')
            user.status = True
            user.otp = None
            user.update_at = datetime.datetime.now()
            session.commit()

            user_list = session.query(UserInfoModel).filter_by(status=False, reg_status=True).all()

            if len(user_list) != 0:
                users = [
                    {'uuid': user.uuid, 'user_id': user.userid, 'username': user.email, 'firstName': user.firstName,
                     'lastName': user.lastName,
                     'phone': user.contact, 'reg_date': user.timestamp} for user in user_list]
                return jsonify({'payload': users, 'error': None}), 200
            else:
                return jsonify({'payload': [], 'error': None}), 200
        else:
            return jsonify({'payload': None, 'error': 'no data found'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@user_bp.route('/pendingList/<uuid>', methods=['DELETE'])
def reject_user(uuid):
    try:
        user = session.query(UserInfoModel).filter_by(uuid=uuid).first()
        if user:
            Sent_email(user.email, 'Account Rejected', f'Sorry your account have been rejected.')
            user.otp = None
            user.reg_status = False
            session.commit()
            user_list = session.query(UserInfoModel).filter_by(status=False, reg_status=True).all()

            if len(user_list) != 0:
                users = [
                    {'uuid': user.uuid, 'user_id': user.userid, 'username': user.email, 'firstName': user.firstName,
                     'lastName': user.lastName,
                     'phone': user.contact, 'reg_date': user.timestamp} for user in user_list]
                return jsonify({'payload': users, 'error': None}), 200
            else:
                return jsonify({'payload': None, 'error': 'no data found'}), 200
        else:
            return jsonify({'payload': None, 'error': 'no data found'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@user_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Admin Page not found"}), 404
