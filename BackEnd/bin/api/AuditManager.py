# AuditManager.py

from sqlalchemy.exc import SQLAlchemyError
from bin.database.db import Audit


class AuditManager:
    def __init__(self, session):
        self.session = session

    def log(self, user_email, action):
        try:
            audit_entry = Audit(user_email=user_email, action=action)
            self.session.add(audit_entry)
            self.session.commit()
            return audit_entry
        except SQLAlchemyError as e:
            self.session.rollback()
            print(f"Error adding audit entry: {str(e)}")
            return None
        except Exception as ex:
            self.session.rollback()
            print(f"An unexpected error occurred: {str(ex)}")
            return None
