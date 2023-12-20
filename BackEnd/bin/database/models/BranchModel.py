from datetime import datetime
from click import DateTime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, LargeBinary, String, DateTime
from sqlalchemy.orm import relationship

from bin.database.base import Base


class BranchsModel(Base):
    __tablename__ = 'branchs'

    branch_name = Column(String(32))
    branch_code = Column(String(4), primary_key=True,
                         unique=True, nullable=False, )
    location = Column(String(100))
    contact = Column(String(5), unique=True)
    tl_atm = Column(Integer)
    tl_pos = Column(Integer)
    status = Column(Boolean)
    timestamp = Column(DateTime, nullable=False, default=datetime.now())
