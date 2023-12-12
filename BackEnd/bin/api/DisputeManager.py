# DisputeManager.py
import base64

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from bin.database.model import Dispute  # Import the Dispute model


class DisputeManager:
    def __init__(self, session):
        self.session = session

    def add(self, pan, acno,channel, txn_date, org_id, org_branch_code, acquirer, maker_user, merchant_name, merchant_location,
            tr_amt, attachment):
        try:

            if attachment is not None:
                # Encode binary data using base64 encoding
                encoded_attachment = base64.b64encode(attachment)
            else:
                encoded_attachment = None  # Set to None if attachment


            new_dispute = Dispute(
                pan=pan,
                acno=acno,
                txn_date=txn_date,
                org_id=org_id,
                org_branch_code=org_branch_code,
                acquirer=acquirer,
                maker_user=maker_user,
                merchant_name=merchant_name,
                merchant_location=merchant_location,
                tr_amt=tr_amt,
                channel=channel,
                attachment=encoded_attachment
            )

            self.session.add(new_dispute)
            self.session.commit()
            return new_dispute.uuid  # Return the newly added dispute object

        except SQLAlchemyError as e:
            self.session.rollback()
            print(f"Error adding dispute entry: {str(e)}")
            raise
        except Exception as ex:
            self.session.rollback()
            print(f"An unexpected error occurred: {str(ex)}")
            raise

    def get(self, dispute_id):
        try:
            dispute = self.session.query(Dispute).filter_by(uuid=dispute_id).first()
            return dispute

        except SQLAlchemyError as e:
            print(f"Error retrieving dispute entry: {str(e)}")
            raise
        except Exception as ex:
            print(f"An unexpected error occurred: {str(ex)}")
            raise

    def get_all(self, limit=200):
        try:
            disputes = self.session.query(Dispute).limit(limit).all()
            return disputes

        except SQLAlchemyError as e:
            print(f"Error retrieving dispute entries: {str(e)}")
            raise
        except Exception as ex:
            print(f"An unexpected error occurred: {str(ex)}")
            raise
