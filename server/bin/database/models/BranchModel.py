from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from bin.database.db import Base
from bin.database.cbs import cbs_query


class BranchsModel(Base):
    __tablename__ = 'branchs'

    branch_name = Column(String(64), nullable=False)
    branch_code = Column(String(16), primary_key=True, unique=True, nullable=False)
    location = Column(String(1024))
    zila = Column(String(32))
    contact = Column(String(32), unique=True)
    tl_atm = Column(Integer)
    tl_pos = Column(Integer)
    timestamp = Column(DateTime, nullable=False, default=datetime.now())


def insert_branch_data(session):
    try:
        branch_data = cbs_query(
            'SELECT CACMPNAM AS branch_name, CACMPCDE AS branch_code, CAADDRS1 || CAADDRS2 as location, CAADDRS3 as '
            'zila FROM ISLBAS.SYPARMAS ORDER BY CACMPCDE')

        for data_point in branch_data:
            # Replace non-ASCII characters in the strings
            cleaned_branch_name = ''.join(char if ord(char) < 128 else ' ' for char in data_point['BRANCH_NAME'])
            cleaned_location = ''.join(char if ord(char) < 128 else ' ' for char in data_point['LOCATION'])

            branch_entry = BranchsModel(
                branch_name=cleaned_branch_name,
                branch_code=data_point['BRANCH_CODE'],
                location=cleaned_location,
                zila=data_point['ZILA']
            )

            session.add(branch_entry)

        session.commit()
        print("Data inserted successfully!")

    except Exception as e:
        print(f"_____Error____ inserting data: {e}")
        session.rollback()
