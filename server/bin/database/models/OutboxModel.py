import datetime
import uuid
from click import DateTime
from sqlalchemy import Column, String, DateTime


from bin.database.base import Base


class OutboxModel(Base):
    __tablename__ = 'outbox'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-SMTP-' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    to = Column(String(32), nullable=False)
    subject = Column(String(64), nullable=False)
    payload = Column(String(2048), nullable=False)
    response = Column(String(255), nullable=False)
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.now())
