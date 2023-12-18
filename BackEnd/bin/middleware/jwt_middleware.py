from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from bin.database.db import database
from bin.database.model import Userinfo

def jwt_middleware(app, blueprints=None):
    session_maker = database()
    session = session_maker()

    @app.before_request
    def check_jwt_token():
        try:
            # Check if the current request requires authentication
            requires_auth = blueprints is not None and request.blueprint in blueprints

            if requires_auth:
                # Verify the JWT token only for routes that require authentication
                verify_jwt_in_request()

                # Get the user identity from the token
                username = get_jwt_identity()

                # Query the database for the user with the specified username and status=True
                user = session.query(Userinfo).filter_by(email=username, status=True, lock=False).first()

                if not user:
                    # User not found or status is false
                    return jsonify(error='User not found or inactive'), 401

        except Exception as e:
            # Handle any exceptions or errors that might occur during the check
            return jsonify(error=f"Error checking user status: {e}"), 500

    return app
