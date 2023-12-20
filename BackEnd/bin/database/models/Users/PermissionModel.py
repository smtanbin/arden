import datetime
import uuid
from sqlalchemy import JSON, Boolean, Column, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.base import Base


class PermissionModel(Base):
    __tablename__ = 'permission'

    uuid = Column(String(50), unique=True, nullable=False,
                  default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, nullable=False,
                       default=datetime.datetime.now())
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(100), nullable=False)
    permissionlist = Column(JSON, nullable=True)
