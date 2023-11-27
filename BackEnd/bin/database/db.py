import datetime
import uuid
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Boolean, Column, Integer, String, JSON, DateTime, create_engine, ForeignKey

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False, default=lambda: 'AUID-USER-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(uuid.uuid4())[-4:].zfill(4))
    email = Column(String(50), unique=True, nullable=False)
    firstName = Column(String(255))
    lastName = Column(String(255))
    status = Column(Boolean, nullable=False)
    contact = Column(String(20), nullable=False)
    password_hash = Column(String(128), nullable=False)
    lock = Column(Boolean, nullable=False, default=True)
    timestamp = Column(DateTime, nullable=False,default=datetime.datetime.now())
    update_at = Column(DateTime, nullable=True)
    permissions = Column(JSON)

    # Add a relationship back-reference
    audits = relationship('Audit', back_populates='user')


class Timeline(Base):
    __tablename__ = 'timeline'

    id = Column(Integer, primary_key=True, autoincrement=True)
    event = Column(String(255))
    timestamp = Column(DateTime, nullable=False, default=datetime.datetime.now())

    # Foreign key relationship to the User table
    user_email = Column(String(50), ForeignKey('users.email'))

    # Use lowercase 'user' for the relationship
    user = relationship('User', back_populates='timeline')


class Audit(Base):
    __tablename__ = 'audit'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False, default=lambda: 'AUID-AUDIT-' + datetime.datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(uuid.uuid4())[-4:].zfill(4))
    # Use the email column for the relationship
    user_email = Column(String(50), ForeignKey('users.email'))
    action = Column(String(255))
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.datetime.now())

    # Use lowercase 'user' for the relationship
    user = relationship('User', back_populates='audits')


DATABASE_URL = 'mysql+pymysql://root:toor@127.0.0.1/arden'

engine = create_engine(DATABASE_URL, echo=True)

try:
    Base.metadata.create_all(engine)
except SQLAlchemyError as e:
    print(f"Error creating database tables: {str(e)}")

Session = sessionmaker(bind=engine)


def get_session():
    return Session()
