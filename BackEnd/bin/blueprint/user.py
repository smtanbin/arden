# user.py


from bin.database.db import Session, User
from bin.api.PasswordManager import PasswordManager
from bin.api.AuditManager import AuditManager

import random
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError


user_bp = Blueprint('user', __name__)


@user_bp.route('/add', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        password = str(random.randint(1111, 9999))
        new_user = User(
            firstName=data['firstName'],
            lastName=data['lastName'],
            status=True,
            lock=True,
            email=data['email'],
            contact=data['contact'],
            password_hash=PasswordManager.set_password(
                data['email'], password),
            permissions=data['permissions']
        )

        session = Session()
        session.add(new_user)
        session.commit()
        audit_manager = AuditManager(session)
        audit_manager.log(str(data['email']), "User added successfully")
        return jsonify({'message': 'User added successfully.', "otp": password})
    except IntegrityError as e:
        # Handle duplicate email entry error
        if 'session' in locals() and session is not None:
            session.rollback()
        return jsonify({'error': 'Duplicate username. User with this email already exists.'}), 400
    except Exception as e:
        if 'session' in locals() and session is not None:
            session.rollback()

        return jsonify({'message': None, 'error': str(e)}), 500
    finally:
        if 'session' in locals() and session is not None:
            session.close()


@user_bp.route('/verify', methods=['POST'])
def verify_user():
    try:
        data = request.get_json()
        username = data.get('username')  # Use get() method to avoid KeyError
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400
        session = Session()
        user = session.query(User).filter_by(email=username).first()
        session.close()

        if user:
            password_hash = user.password_hash
            if PasswordManager.is_valid_password(username, password_hash, password):
                return jsonify({'message': 'User verified successfully.'}), 200
            else:
                return jsonify({'message': 'Invalid password.'}), 401
        else:
            return jsonify({'message': 'User not found.'}), 404

    except Exception as e:
        session.close()
        return jsonify({'error': str(e)}), 500


@user_bp.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data['username']
    old_password = data['old_password']
    new_password = data['new_password']

    if not username or not old_password or not new_password:
        return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400

    user = Session.query(User).filter_by(email=username).first()

    if user:
        # Assuming 'password_hash' is the attribute in your User model
        password_hash = user.password_hash
        if PasswordManager.is_valid_password(username, password_hash, old_password):

            user.password_hash = PasswordManager.set_password(
                username, new_password)
            Session.commit()

            return jsonify({'message': 'Password update successfully successfully.'}), 200
        else:
            return jsonify({'message': 'Invalid password.'}), 401
    else:
        return jsonify({'message': 'User not found.'}), 404


@user_bp.route('/lock', methods=['POST'])
def lock_user():
    data = request.get_json()
    username = data['name']

    user = Session.query(User).filter_by(email=username).first()
    if user:
        user.lock = False
        Session.commit()
        return jsonify({'message': 'User locked successfully.'})
    else:
        return jsonify({'message': 'User not found.'}), 404


@user_bp.route('/about', methods=['GET'])
def echo():
    return jsonify({
        "Modue": "User Management",
        "Author": "Tanbin Hassan Bappi",
        "License": "Mozilla Public Licence",
    }), 200


@user_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Admin Page not found"}), 404
