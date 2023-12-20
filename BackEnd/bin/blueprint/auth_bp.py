# auth_bp.py
from datetime import timedelta
import random

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from bin.api.AuditManager import AuditManager
from bin.api.PasswordManager import PasswordManager
from bin.database.db import database
from bin.database.model import Userinfo, LoginSession
from bin.mail.smtp import Sent_email
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth_bp', __name__)
session_maker = database()
session = session_maker()


@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        if all(data.get(field) for field in ['firstName', 'lastName', 'email', 'contact', 'permissions']):
            password = str(random.randint(100000, 999999))

            new_user = Userinfo(
                firstName=data['firstName'],
                lastName=data['lastName'],
                status=True,
                lock=False,
                email=data['email'],
                contact=data['contact'],
                password_hash=PasswordManager.set_password(data['email'], password),
                permissions=data['permissions']
            )
            session.add(new_user)
            session.commit()

            subject = f"Account Confirmation for {data['email']}"
            body = f"Your password is: {password}. This OTP is valid for a short period of time."
            smtpreplay = Sent_email(data['email'], subject, body)

            print("___mail___", smtpreplay)

            # audit_manager = AuditManager(session)
            # audit_manager.log(str(data['email']), "User added successfully")

            print(password)

            return jsonify({'message': 'User added successfully.', "otp": password})
        else:
            return jsonify({'error': 'mandatory parameter not found', 'message': None}), 400

    except IntegrityError as e:
        # Handle duplicate email entry error
        session.rollback()
        return jsonify({'error': 'Duplicate username. User with this email already exists.'}), 400
    except Exception as e:
        print(e)
        session.rollback()
        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        session.close()


@auth_bp.route('/login', methods=['POST'])
def check_user():
    try:
        data = request.get_json()
        username = data.get('username')  # Use get() method to avoid KeyError
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400

        user = session.query(Userinfo).filter_by(email=username, status=True).first()

        if user:
            password_hash = user.password_hash
            if PasswordManager.is_valid_password(username, password_hash, password):
                token = [create_access_token(identity=username, expires_delta=timedelta(minutes=7)),
                         create_access_token(identity=user.uuid)]
                login_session = LoginSession(token=token[1], user_uuid=user.uuid)
                session.add(login_session)
                session.commit()
                session.close()

                return jsonify({'message': 'success', 'token': token}), 200
            else:
                session.close()
                return jsonify({'message': 'Invalid password.'}), 200
        else:
            session.close()
            return jsonify({'message': 'User not found.'}), 200

    except Exception as e:
        session.close()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
def verify_user():
    try:
        data = request.get_json()
        username = data.get('username')
        refresh_token = data.get('refreshToken')

        user = session.query(Userinfo).filter_by(email=username, status=True).first()
        token = session.query(LoginSession).filter_by(user_uuid=user.uuid, status=True).first()
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

    user = session.query(Userinfo).filter_by(email=username).first()

    if user:
        if otp == user.otp:
            user.password_hash = PasswordManager.set_password(
                username, new_password)
            user.otp = None  # Clear OTP after successful password reset
            session.commit()

            return jsonify({'message': 'Password update successfully successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid password.'}), 401
    else:
        return jsonify({'message': 'User not found.'}), 404


@auth_bp.route('/reset_otp/<username>', methods=['GET'])
def send_otp(username):
    try:
        user = session.query(Userinfo).filter_by(email=username).first()

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

    user = session.query(Userinfo).filter_by(email=username, status=True).first()
    if user is None:
        return jsonify({'success': False, 'error': 'user not found'}), 401

    token = session.query(LoginSession).filter_by(user_uuid=user.uuid, token=refresh_token, status=True).first()
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


@auth_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Page not found"}), 404
