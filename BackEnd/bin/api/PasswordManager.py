import hashlib
import secrets


class PasswordManager:
    def __init__(self):
        pass

    def set_password(self, username, password):
        salt = secrets.token_hex(8)
        key = hashlib.sha512(username.encode()).hexdigest()
        hashed_password = hashlib.pbkdf2_hmac(
            'sha256', password.encode(), key.encode(), 100000)
        return salt + hashed_password.hex()

    def is_valid_password(username, stored_password, provided_password):
        salt = stored_password[:16]  # Extract salt from stored password
        # Extract hashed password from stored password
        stored_hash = stored_password[16:]

        key = hashlib.sha512(username.encode()).hexdigest()
        provided_hash = hashlib.pbkdf2_hmac(
            'sha256', provided_password.encode(), key.encode(), 100000).hex()

        return stored_hash == provided_hash
