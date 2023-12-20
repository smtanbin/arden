# DisputeManager.py
import base64
from datetime import datetime

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import desc, func

from bin.database.models.DisputeModels.DisputeModel import Dispute
from bin.database.models.DisputeModels.DisputeAttachmentModel import DisputeAttachmentModel


class DisputeManager:
    def __init__(self, session):
        self.session = session

    def add(self, pan, acno, channel, txn_date, org_id, org_branch_code, acquirer, maker_user, merchant_name,
            merchant_location,
            tr_amt, attachment):
        try:
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
            )

            self.session.add(new_dispute)
            self.session.commit()

            if attachment is not None:
                # Encode binary data using base64 encoding
                encoded_attachment = base64.b64encode(attachment)
                attachment = DisputeAttachmentModel(
                    attachment_data=encoded_attachment,
                    dispute_uuid=new_dispute.uuid
                )
            self.session.add(attachment)
            self.session.commit()

            return new_dispute.uuid  # Return the newly added dispute object

        except SQLAlchemyError as e:
            self.session.rollback()
            print(f"Error adding dispute entry: {str(e)}")
            raise


def get(self, dispute_id):
    try:
        dispute = self.session.query(
            Dispute).filter_by(uuid=dispute_id).first()
        return dispute

    except SQLAlchemyError as e:
        print(f"Error retrieving dispute entry: {str(e)}")
        raise
    except Exception as ex:
        print(f"An unexpected error occurred: {str(ex)}")
        raise


def get_image(self, dispute_id):
    try:
        dispute = self.session.query(
            DisputeAttachmentModel).filter_by(uuid=dispute_id).first()
        return dispute.attachment

    except SQLAlchemyError as e:
        print(f"Error retrieving dispute entry: {str(e)}")
        raise
    except Exception as ex:
        print(f"An unexpected error occurred: {str(ex)}")
        raise


def get_all(self, limit=200):
    try:
        disputes = self.session.query(Dispute).order_by(
            desc(Dispute.timestamp)).limit(limit).all()
        return disputes

    except SQLAlchemyError as e:
        print(f"Error retrieving dispute entries: {str(e)}")
        raise
    except Exception as ex:
        print(f"An unexpected error occurred: {str(ex)}")
        raise


def data_between_date(self, from_date_str=None, to_date_str=None):
    from_date = datetime.strptime(
        from_date_str, '%Y-%m-%d') if from_date_str else None
    to_date = datetime.strptime(
        to_date_str, '%Y-%m-%d') if to_date_str else None

    try:
        dispute = self.session.query(Dispute).filter(
            func.date(Dispute.timestamp).between(from_date, to_date))
        return dispute

    except SQLAlchemyError as e:
        print(f"Error retrieving dispute entries between dates: {str(e)}")
        raise
    except Exception as ex:
        print(f"An unexpected error occurred: {str(ex)}")
        raise
