import datetime
import uuid
from click import DateTime
from sqlalchemy import JSON, Boolean, Column, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.base import Base


class UserInfoModel(Base):
    __tablename__ = 'userinfo'

    # Primary key
    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-USER-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))

    email = Column(String(50), unique=True, nullable=False)
    firstName = Column(String(255))
    lastName = Column(String(255))
    status = Column(Boolean, nullable=False)
    contact = Column(String(20), nullable=False)
    password_hash = Column(String(128), nullable=False)
    lock = Column(Boolean, nullable=False, default=True)
    lock_timestamp = Column(DateTime, nullable=False,
                            default=datetime.datetime.now())
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.datetime.now())
    update_at = Column(DateTime, nullable=True)
    permissions = Column(JSON)
    branch = Column(String(20))
    otp = Column(String(20))
    passwordTry = Column(String(1))
    lastLogin = Column(DateTime, nullable=True)

    # Relationships
    audits = relationship('AuditModel', back_populates='user')
    login_session = relationship('LoginSessionModel', back_populates='user')
    authorized_silp_data = relationship(
        'AuthorizedSilpDataModel', back_populates='user')
