import os

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa


def generate_key():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    private_key_path = os.path.join(project_dir, "key", f"private_key_jwt.pem")
    public_key_path = os.path.join(project_dir, "key", f"private_key_jwt.pem")

    print(f"Check if the {project_dir}/Key directory exists, create it if not")
    os.makedirs(os.path.join(project_dir, "key"), exist_ok=True)

    # Generate RSA key pair
    print("Generate RSA key pair")
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    print("Save private key to file")
    with open(private_key_path, "wb") as private_key_file:
        private_key_file.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
        )

    print("Extract public key from private key and save it to file")
    public_key = private_key.public_key()
    with open(public_key_path, "wb") as public_key_file:
        public_key_file.write(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        )

    print(f"RSA key pair generated and saved to {private_key_path} and {public_key_path}")
