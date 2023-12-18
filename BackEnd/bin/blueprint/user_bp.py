# user_bp.py

from bin.database.db import database
from bin.database.model import Userinfo
from bin.api.PasswordManager import PasswordManager
from bin.api.AuditManager import AuditManager

import random
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

user_bp = Blueprint('user', __name__)
session_maker = database()
session = session_maker()


@user_bp.route('/add', methods=['POST'])
def add_user():
    try:
        data = request.get_json()

        if all(data.get(field) for field in ['firstName', 'lastName', 'email', 'contact', 'permissions']):
            password = str(random.randint(1111, 9999))

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

            audit_manager = AuditManager(session)
            audit_manager.log(str(data['email']), "User added successfully")

            return jsonify({'message': 'User added successfully.', "otp": password})
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
    Session = database()
    data = request.get_json()
    username = data['username']
    old_password = data['old_password']
    new_password = data['new_password']

    if not username or not old_password or not new_password:
        return jsonify({'message': 'Invalid request. Please provide both username and password.'}), 400

    user = Session.query(Userinfo).filter_by(email=username).first()

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
    Session = database()
    data = request.get_json()
    username = data['name']

    user = Session.query(Userinfo).filter_by(email=username).first()
    if user:
        user.lock = True
        Session.commit()
        return jsonify({'message': 'User locked successfully.'})
    else:
        return jsonify({'message': 'User not found.'}), 404


@user_bp.errorhandler(404)
def admin_page_not_found():
    return jsonify({"error": "Admin Page not found"}), 404
