import os

from bin.sys.hardware_id import get_hardware_id
from bin.sys.key_storage import store_jwt_secret, retrieve_jwt_hash


def setup():
    # Get the absolute path to the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print("Getting hardware key")
    hardware_id = get_hardware_id().replace("-", "")
    print("Getting JWT Secret")
    store_jwt_secret(hardware_id)

