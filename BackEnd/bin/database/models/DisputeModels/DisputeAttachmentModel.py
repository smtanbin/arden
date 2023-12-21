from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import relationship

from bin.database.db import Base


class DisputeAttachmentModel(Base):
    __tablename__ = 'dispute_attachment'

    id = Column(Integer, primary_key=True, autoincrement=True)
    attachment_data = Column(LargeBinary, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.now())

    dispute_uuid = Column(String(32), ForeignKey('dispute.uuid'))
    dispute = relationship('Dispute', back_populates='attachments')
