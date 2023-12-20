from datetime import datetime
import uuid

from sqlalchemy import Boolean, Column, DateTime, and_, String, inspect, Date
from sqlalchemy.orm import relationship

from bin.database.base import Base


class Dispute(Base):
    __tablename__ = 'dispute'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'DP' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    pan = Column(String(17))
    acno = Column(String(17))
    title = Column(String(24))
    timestamp = Column(DateTime, nullable=False, default=datetime.now())
    acquirer = Column(String(24))
    org_branch_code = Column(String(5), nullable=False)
    org_id = Column(String(24), nullable=False)
    txn_date = Column(Date, nullable=False)
    terminal_id = Column(String(32))
    merchant_bank = Column(String(32))
    merchant_name = Column(String(32))
    merchant_location = Column(String(32))
    tr_amt = Column(String(100), nullable=False)
    dispute_amt = Column(String(100))
    refund_amt = Column(String(100))
    massage = Column(String(300))
    channel = Column(String(8), nullable=False)
    complain_date = Column(Date)
    doc_no = Column(String(64))
    stan = Column(String(64))
    maker_user = Column(String(50), nullable=False)
    open_date = Column(DateTime)
    resolved = Column(Boolean)
    bb_dispute_id = Column(String(64))
    submitted = Column(Boolean)
    approved = Column(Boolean)
    approvedDate = Column(DateTime)
    remark = Column(String(300))
    checkerUser = Column(String(50))
    authorizedUser = Column(String(50))
    attachments = relationship('DisputeAttachment', back_populates='dispute')

    def data_between_date(self, limit, from_date=None, to_date=None):
        query = Dispute.query

        if from_date and to_date:
            from_timestamp = datetime.strptime(
                from_date, '%Y-%m-%d').timestamp()
            to_timestamp = datetime.strptime(to_date, '%Y-%m-%d').timestamp()

            query = query.filter(
                and_(Dispute.timestamp >= from_timestamp, Dispute.timestamp <= to_timestamp))
        elif from_date:
            from_timestamp = datetime.strptime(
                from_date, '%Y-%m-%d').timestamp()
            query = query.filter(Dispute.timestamp >= from_timestamp)
        elif to_date:
            to_timestamp = datetime.strptime(to_date, '%Y-%m-%d').timestamp()
            query = query.filter(Dispute.timestamp <= to_timestamp)

        disputes = query.limit(limit).all()
        return disputes

    def serialize(self):
        """
        Serialize the object into a dictionary.
        """
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
