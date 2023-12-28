from datetime import datetime
import uuid

from sqlalchemy import Boolean, Column, DateTime, String, inspect, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship

from bin.database.db import Base


class CardActivationModel(Base):
    __tablename__ = 'card_activation'

    uuid = Column(String(64), primary_key=True, unique=True, nullable=False,
                  default=lambda: 'CARD-AT' + datetime.now().strftime('%Y%m-%d%H-%M%S') + '-' + str(
                      uuid.uuid4())[-4:].zfill(4))
    pan = Column(String(17))
    acno = Column(String(17))
    title = Column(String(24))
    contact = Column(String(12), nullable=False)
    submitted_at = Column(DateTime, nullable=False, default=datetime.now())
    submitted_by_uuid = Column(String(32), ForeignKey('userinfo.uuid'), nullable=False)
    submitted_by = relationship('UserInfoModel', foreign_keys=[submitted_by_uuid])
    issue_branch_code = Column(String(5), nullable=False)
    org_branch_code = Column(String(5), nullable=False)
    massage = Column(String(300))
    attachment = Column(LargeBinary, nullable=False)
    update_by_uuid = Column(String(32), ForeignKey('userinfo.uuid'), nullable=True)
    update_by = relationship('UserInfoModel', foreign_keys=[update_by_uuid], nullable=True)
    update_at = Column(DateTime, nullable=True)
    approved = Column(Boolean, nullable=True)
    rejected = Column(Boolean, nullable=True)


    def serialize(self):
        """
        Serialize the object into a dictionary.
        """
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
