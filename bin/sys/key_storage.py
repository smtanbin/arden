import os
import hashlib
import base64
from bin.sys.hardware_id import get_hardware_id


def generate_key():
    hardware_id = get_hardware_id().replace("-", "")
    return hashlib.sha256(hardware_id.encode()).digest()


def encrypt(data):
    data_bytes = data.encode('utf-8')
    hashed_data = hashlib.sha256(data_bytes).digest()
    encrypted_data = base64.b64encode(hashed_data + data_bytes).decode('utf-8')
    return encrypted_data


def decrypt(data):
    decoded_data = base64.b64decode(data.encode('utf-8'))
    hashed_data = decoded_data[:32]
    original_data = decoded_data[32:].decode('utf-8')

    if hashed_data == hashlib.sha256(original_data.encode('utf-8')).digest():
        return original_data
    else:
        raise ValueError("Data integrity check failed")


def store_jwt_secret(data):
    try:
        key_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "key", "jwt")
        os.makedirs(key_folder, exist_ok=True)
        file_path = os.path.join(key_folder, ".key")
        with open(file_path, "w") as file:
            file.write(encrypt(data))
        return True
    except Exception as e:
        print(f"Error storing data: {e}")
        return False


def retrieve_jwt_hash():
    try:
        key_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "key", "jwt")
        file_path = os.path.join(key_folder, ".key")

        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                return [decrypt(file.read()), None]
        else:
            return [None, f"No data retrieved. File {file_path} does not exist."]
    except Exception as e:
        return [None, f"Error retrieving data: {e}"]
