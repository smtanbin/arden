# auth_bp.py
from datetime import timedelta, datetime
import random

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from bin.api.PasswordManager import PasswordManager

from bin.database.db import database
from bin.database.models.BranchModel import BranchsModel
from bin.database.models.LoginSessionModel import LoginSessionModel
from bin.database.models.Users.UserInfoModel import UserInfoModel

from bin.mail.smtp import Sent_email
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth_bp', __name__)
session_maker = database()
session = session_maker()
pm = PasswordManager()


@auth_bp.route('/signup', methods=['POST'])
def signup():
    _permissions = []
    try:
        data = request.get_json()

        if all(data.get(field) for field in ['employeeid', 'firstName', 'lastName', 'email', 'contact', 'branch']):
            otp = str(random.randint(100000, 999999))

            if data['permissions'] is not None:
                _permissions = data['permissions']
            else:
                # Default permission
                _permissions = ['dispute_list', 'dispute_maker', 'home',
                                'card_activation_maker']

            username = str(data['email']).lower()

            new_user = UserInfoModel(
                userid=data['employeeid'],
                firstName=data['firstName'],
                lastName=data['lastName'],
                branch=data['branch'],
                status=False,
                lock=False,
                email=username,
                password_hash=pm.set_password(data['email'], otp),
                contact=data['contact'],
                otp=otp,
                permissions=_permissions

            )
            session.add(new_user)
            session.commit()

            return jsonify({'message': 'User added successfully.', 'error': None}), 200
        else:
            return jsonify({'error': 'mandatory parameter not found', 'message': None}), 200

    except IntegrityError as e:
        print(e)
        session.rollback()
        return jsonify({'error': 'Duplicate username. User with this email already exists.'}), 200
    except Exception as e:
        print(e)
        session.rollback()
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@auth_bp.route('/branchs', methods=['GET'])
def branch_list():
    try:
        # Fetch only the required columns
        branchs = session.query(BranchsModel.branch_code.label('CODE'), BranchsModel.branch_name.label('NAME')).all()

        # Convert the query result to a list of dictionaries
        branchs_data = [{"CODE": branch.CODE, "NAME": branch.NAME} for branch in branchs]

        return jsonify({"payload": branchs_data, "error": None})
    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 200


@auth_bp.route('/login', methods=['POST'])
def check_user():
    try:
        data = request.get_json()
        password = data.get('password')
        username = str(data.get('username')).lower()

        if not username or not password:
            return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400

        user = session.query(UserInfoModel).filter_by(
            email=username, status=True).first()

        if user:

            if pm.is_valid_password(user.email, user.password_hash, password):
                token = [create_access_token(identity=username, expires_delta=timedelta(minutes=7)),
                         create_access_token(identity=user.uuid)]

                login_session = LoginSessionModel(
                    token=token[1], user_uuid=user.uuid)

                session.add(login_session)
                session.commit()

                return jsonify({'message': 'success', 'token': token}), 200
            else:
                if user.passwordTry <= 0:
                    user.lock = True
                else:
                    user.passwordTry = user.passwordTry - 1

                session.commit()
                return jsonify({'message': f'Invalid password. You have {3 - user.passwordTry} remaining.'}), 200
        else:
            return jsonify({'message': 'User not found.'}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

    finally:
        session.close()


@auth_bp.route('/refresh', methods=['POST'])
def verify_user():
    try:
        data = request.get_json()
        username = str(data.get('username')).lower()
        refresh_token = data.get('refreshToken')

        user = session.query(UserInfoModel).filter_by(
            email=username, status=True).first()
        token = session.query(LoginSessionModel).filter_by(
            user_uuid=user.uuid, status=True).first()
        session.close()

        if user & token == refresh_token:
            return jsonify(
                {'success': True, 'token': create_access_token(identity=username, expires_delta=timedelta(minutes=7)),
                 'error': None}), 200
        else:
            return jsonify({'success': False, 'token': None, 'error': 'token or user not match'}), 401
    except Exception as e:
        return jsonify({'success': False, 'token': None, 'error': str(e)}), 401


@auth_bp.route('/forget_password', methods=['POST'])
def forget_password():
    data = request.get_json()
    username = data['username']
    otp = data['otp']
    new_password = data['new_password']

    user = session.query(UserInfoModel).filter_by(email=username).first()

    if user:
        if otp == user.otp:
            user.password_hash = pm.set_password(
                username, new_password)
            user.otp = None
            user.lastLogin = 3
            session.commit()

            return jsonify({'message': 'Password update successfully successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid password.'}), 401
    else:
        return (jsonify({'message': 'User not found.'})), 404


@auth_bp.route('/password_reset', methods=['POST'])
def password_reset():
    data = request.get_json()
    username = data['username']
    password = data['password']
    new_password = data['new_password']

    user = session.query(UserInfoModel).filter_by(email=username).first()

    if user:
        val = pm.is_valid_password(username, str(user.password_hash), password)
        if val:
            user.password_hash = pm.set_password(username, new_password)
            user.otp = None
            user.passwordTry = 3
            user.lastLogin = datetime.utcnow()
            session.commit()
            return jsonify({'message': 'Password update successfully successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid password.'}), 401
    else:
        return jsonify({'message': 'User not found.'}), 404


@auth_bp.route('/reset_otp/<username>', methods=['GET'])
def send_otp(username):
    try:
        user = session.query(UserInfoModel).filter_by(email=username).first()

        if user:
            otp = str(random.randint(100000, 999999))
            subject = "Your OTP for Verification"
            body = f"Your OTP is: {otp}. This OTP is valid for a short period of time."
            Sent_email(username, subject, body)
            user.otp = otp
            session.commit()
            return jsonify({'success': True, 'message': 'OTP sent successfully.'}), 200
        else:
            print(f"Error: user not found")
            return jsonify(
                {'success': False, 'message': 'User not found.'}), 404  # Updated status code to 404 for "Not Found"
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal Server Error'}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    username = data.get('username')
    refresh_token = data.get('refreshToken')

    user = session.query(UserInfoModel).filter_by(
        email=username, status=True).first()
    if user is None:
        return jsonify({'success': False, 'error': 'user not found'}), 401

    token = session.query(LoginSessionModel).filter_by(
        user_uuid=user.uuid, token=refresh_token, status=True).first()
    if token is None:
        return jsonify({'success': False, 'error': 'token not found'}), 401
    else:
        if token.token == refresh_token:
            token.status = False
            session.commit()
            session.close()
            return jsonify({'success': True, 'error': None}), 200
        else:
            session.close()
            return jsonify({'success': False, 'error': 'token or user not match'}), 401


@auth_bp.route('/last_login/<username>', methods=['GET'])
def last_login(username):
    try:
        user = session.query(UserInfoModel).filter_by(email=username).first()

        if user:
            print(user.lastLogin)
            if user.lastLogin is None:
                return jsonify({'code': 2, 'error': None}), 205
            else:
                user.passwordTry = 3
                user.lastLogin = datetime.utcnow()
                session.commit()
                return jsonify({'code': 1, 'error': None}), 200
        else:
            return jsonify({'code': 0, 'error': 'User not found.'}), 404

    except Exception as e:
        print(e)
        return jsonify({'status_code': 500, 'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@auth_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Page not found"}), 404
