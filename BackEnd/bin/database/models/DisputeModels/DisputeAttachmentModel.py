import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import relationship

from bin.database.db import Base


class DisputeAttachmentModel(Base):
    __tablename__ = 'dispute_attachment'

    uuid = Column(String(64), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'DPA-' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    attachment_data = Column(LargeBinary, nullable=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.now())

    dispute_uuid = Column(String(32), ForeignKey('dispute.uuid'))
    dispute = relationship('Dispute', back_populates='attachments')
