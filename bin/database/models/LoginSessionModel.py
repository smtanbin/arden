import datetime
from click import DateTime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.db import Base


class LoginSessionModel(Base):
    __tablename__ = 'login_session'

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(2048))
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.datetime.now())
    status = Column(Boolean, nullable=False, default=True)
    user_uuid = Column(String(32), ForeignKey('userinfo.uuid'))  # Foreign key

    # Relationship
    user = relationship('UserInfoModel', back_populates='login_session')
