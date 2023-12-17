import datetime
import uuid

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, LargeBinary, JSON, Date, inspect
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
    token = Column(String(2048))
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
    authorizedUser = Column(String(50), ForeignKey('userinfo.uuid'))  # Add a foreign key

    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())

    # Relationship
    user = relationship('Userinfo', back_populates='authorized_silp_data')


class Branchs(Base):
    __tablename__ = 'branchs'

    branch_name = Column(String(32))
    branch_code = Column(String(4), primary_key=True, unique=True, nullable=False, )
    location = Column(String(100))
    contact = Column(String(5), unique=True)
    tl_atm = Column(Integer)
    tl_pos = Column(Integer)
    status = Column(Boolean)
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())


class LinkService(Base):
    __tablename__ = 'link_service'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-LS-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    service_url = Column(String(128))
    auth_user = Column(String(32))
    auth_passwd = Column(String(100))
    port = Column(String(5))
    service_param = Column(String(64))
    status = Column(Boolean)
    service_name = Column(String(32))
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())


class Dispute(Base):
    __tablename__ = 'dispute'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'DP' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    pan = Column(String(17))
    acno = Column(String(17))
    title = Column(String(24))
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())
    acquirer = Column(String(24))
    org_branch_code = Column(String(5), nullable=False)
    org_id = Column(String(24), nullable=False)
    txn_date = Column(Date, nullable=False)
    terminal_id = Column(String(32))
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
    attachment = Column(LargeBinary, nullable=True)
    maker_user = Column(String(50), nullable=False)
    open_date = Column(DateTime)
    resolved = Column(Boolean)
    bb_dispute_id = Column(String(64))
    submitted = Column(Boolean)
    approved = Column(Boolean)
    approvedDate = Column(DateTime)
    remark = Column(String(300))
    authorizedUser = Column(String(50))

    def serialize(self):
        """
        Serialize the object into a dictionary.
        """
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
