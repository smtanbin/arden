import datetime
import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, LargeBinary, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Userinfo(Base):
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
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())
    update_at = Column(DateTime, nullable=True)
    permissions = Column(JSON)
    jwt_token = Column(String(255))  # Add a column for JWT token

    # Relationships
    audits = relationship('Audit', back_populates='user')
    login_session = relationship('LoginSession', back_populates='user')
    authorized_silp_data = relationship('AuthorizedSilpData', back_populates='user')


class LoginSession(Base):
    __tablename__ = 'login_session'

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(255))
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())
    status = Column(Boolean, nullable=False, default=True)
    user_uuid = Column(String(32), ForeignKey('userinfo.uuid'))  # Foreign key

    # Relationship
    user = relationship('Userinfo', back_populates='login_session')


class Audit(Base):
    __tablename__ = 'audit'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-AUDIT-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    # Use the email column for the relationship
    user_email = Column(String(50), ForeignKey('userinfo.uuid'))
    action = Column(String(255))
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.datetime.now())

    # Relationship
    user = relationship('Userinfo', back_populates='audits')


class AuthorizedSilpData(Base):
    __tablename__ = 'authorized_silp_data'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-ASLIP-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    pan = Column(String(17))
    acno = Column(String(17))
    slip = Column(LargeBinary)  # storing image data
    contact = Column(String(17))
    status = Column(String(2))
    makerUser = Column(String(50))  # Foreign key
    authorizedUser = Column(String(50))  # Foreign key
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())

    # Relationship
    user = relationship('Userinfo', back_populates='authorized_silp_data')
