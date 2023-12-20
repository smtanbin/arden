
from datetime import datetime
import uuid
from click import DateTime
from sqlalchemy import Column, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.base import Base


class AuditModel(Base):
    __tablename__ = 'audit'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-AUDIT-' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))

    user_email = Column(String(50), ForeignKey('userinfo.uuid'))
    action = Column(String(255))
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.now())

    # Relationship
    user = relationship('UserInfoModel', back_populates='audits')
