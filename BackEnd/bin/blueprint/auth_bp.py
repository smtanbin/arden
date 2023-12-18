# auth_bp.py
from datetime import timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

from bin.api.PasswordManager import PasswordManager
from bin.database.db import database
from bin.database.model import Userinfo, LoginSession

auth_bp = Blueprint('auth_bp', __name__)
session_maker = database()
session = session_maker()


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
                return jsonify({'message': 'Invalid password.'}), 401
        else:
            session.close()
            return jsonify({'message': 'User not found.'}), 404

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
    return jsonify({"error": "Admin Page not found"}), 404
