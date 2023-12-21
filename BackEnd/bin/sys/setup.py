from bin.api.PasswordManager import PasswordManager
from bin.database.db import database
from bin.database.models.BranchModel import insert_branch_data
from bin.database.models.RawData.AcquirerModel import AcquirerModel
from bin.database.models.Users.UserInfoModel import UserInfoModel
from bin.data.acquirer_list import acquirer_data

session_maker = database()
session = session_maker()
pm = PasswordManager()


def injectAcquirer(value):
    try:
        newAcquirer = AcquirerModel(acquirer_name=value)
        session.add(newAcquirer)
        session.commit()
    except Exception as e:
        print(f"Error injecting Acquirer: {e}")
        session.rollback()


def setup():
    insert_branch_data(session)

    # Create an instance of PasswordManager
    PsMan = PasswordManager()

    # Check if admin user exists
    admin_user = session.query(UserInfoModel).filter_by(userid='00000').first()

    if not admin_user:
        # If admin user does not exist, create it
        new_user = UserInfoModel(
            userid='00000',
            firstName='admin',
            lastName='admin',
            status=True,
            lock=False,
            email='admin',
            contact='admin',
            password_hash=PsMan.set_password('admin', 'admin'),
            permissions='{"admin": true}',
        )
        session.add(new_user)
        session.commit()
    else:
        print("Admin user already exists.")

    # for acquirer_item in acquirer_data:
    #     injectAcquirer(acquirer_item)
