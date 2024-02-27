from datetime import datetime
from sqlalchemy import Column, DateTime, Boolean, Integer, String

from bin.database.db import Base


class AcquirerModel(Base):
    __tablename__ = 'acquirer_model'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, default=datetime.now())
    acquirer_name = Column(String(64), nullable=False)
    active = Column(Boolean, nullable=False, default=True)



