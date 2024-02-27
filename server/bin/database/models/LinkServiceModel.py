from datetime import datetime
import uuid
from click import DateTime
from sqlalchemy import Boolean, Column,  String, DateTime


from bin.database.base import Base


class LinkServiceModel(Base):
    __tablename__ = 'link_service'

    uuid = Column(String(32), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'AUID-LS-' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    service_url = Column(String(128))
    auth_user = Column(String(32))
    auth_passwd = Column(String(100))
    port = Column(String(5))
    service_param = Column(String(64))
    status = Column(Boolean)
    service_name = Column(String(32))
    timestamp = Column(DateTime, nullable=False, default=datetime.now())
