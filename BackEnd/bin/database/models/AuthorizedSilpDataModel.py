import datetime
import uuid
from click import DateTime
from sqlalchemy import Column, ForeignKey, LargeBinary, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.base import Base


class AuthorizedSilpDataModel(Base):
    __tablename__ = 'authorized_silp_data'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-ASLIP-' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    pan = Column(String(17))
    acno = Column(String(17))
    slip = Column(LargeBinary)  # storing image data
    contact = Column(String(17))
    status = Column(String(2))
    makerUser = Column(String(50))  # Foreign key
    authorizedUser = Column(String(50), ForeignKey(
        'userinfo.uuid'))  # Add a foreign key

    timestamp = Column(DateTime, nullable=False, default=datetime.now())

    # Relationship
    user = relationship('UserInfoModel', back_populates='authorized_silp_data')
