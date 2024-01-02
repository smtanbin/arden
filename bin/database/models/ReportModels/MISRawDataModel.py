from sqlalchemy import Column, String, Integer, DateTime, exists, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased, relationship

from bin.database.db import Base, database

session_maker = database()
session = session_maker()

class MISParticularModel(Base):
    __tablename__ = 'mis_particular'

    sl = Column(String(64), primary_key=True, nullable=False)
    particular = Column(String(300), nullable=False)

class MISRawDataModel(Base):
    __tablename__ = 'mis_raw_data'

    usl = Column(Integer, primary_key=True, autoincrement=True)
    sl = Column(String(64), ForeignKey('mis_particular.sl'), nullable=False)
    r_month = Column(String(16), nullable=False)
    r_year = Column(String(1024), nullable=False)
    value = Column(String(32), nullable=False)
    note = Column(String(300), unique=True)
    timestamp = Column(DateTime, nullable=False, server_default=func.now())

    # Define the relationship to MISParticularModel
    particular_info = relationship(MISParticularModel, backref="raw_data")


def check_record_exists(sl, r_month, r_year):
    """Check if a record with the given sl, r_month, and r_year already exists."""
    return session.query(exists().where(
        (MISRawDataModel.sl == sl) &
        (MISRawDataModel.r_month == r_month) &
        (MISRawDataModel.r_year == r_year)
    )).scalar()


def add_new_record(sl, r_month, r_year, value, note=None):
    """Add a new record to the database."""
    if not check_record_exists(sl, r_month, r_year):
        new_record = MISRawDataModel(sl=sl, r_month=r_month, r_year=r_year, value=value, note=note)
        session.add(new_record)
        session.commit()
        print(f"Record added: SL={sl}, R_Month={r_month}, R_Year={r_year}")
        return [True, new_record.usl]
    else:
        print(f"Record already exists: SL={sl}, R_Month={r_month}, R_Year={r_year}")
        return [False, None]


def insertNotDuplicate(year, month, data):
    try:
        # Assuming data is a list of dictionaries
        for entry in data:
            sl = str(entry.get('SL'))
            r_month = str(month)
            r_year = str(year)
            value = '0' if entry.get('VALUE') is None else entry.get('VALUE')
            note = entry.get('Particulars')  # Set this to an appropriate value if applicable

            # Check if the record already exists
            exists = check_record_exists(sl=sl, r_month=r_month, r_year=r_year)

            if not exists:
                # Insert the new record
                add_new_record(sl=sl, r_month=r_month, r_year=r_year, value=value, note=note)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        session.close()


def bulkAdd(data):
    try:
        # Assuming data is a list of dictionaries
        for entry in data:

            sl = str(entry.get('SL'))
            r_month = str(entry.get('MONTH'))
            r_year = str(entry.get('YEAR'))
            value = '0' if entry.get('VALUE') is None else str(entry.get('VALUE'))
            note = None

            # Ensure that required fields are not None or null
            if sl is not None and r_month is not None and r_year is not None:
                # Check if the record already exists
                exists = check_record_exists(sl=sl, r_month=r_month, r_year=r_year)

                if not exists:
                    # Insert the new record
                    add_new_record(sl=sl, r_month=r_month, r_year=r_year, value=value, note=note)
                else:
                    print(f"Record already exists: SL={sl}, R_Month={r_month}, R_Year={r_year}")
            else:
                print("Error: Some required fields are None.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        session.close()


def get_mis_data(r_year):
    try:
        # Alias the table to use it in the subquery
        subquery = aliased(MISRawDataModel)

        # Define the main query
        query = (
            session.query(
                MISRawDataModel.sl,
                func.max(subquery.note).label('particulars'),
                func.max(func.CASE([(subquery.r_month == '1', subquery.value)])).label('JAN'),
                func.max(func.CASE([(subquery.r_month == '2', subquery.value)])).label('FEB'),
                func.max(func.CASE([(subquery.r_month == '3', subquery.value)])).label('MAR'),
                func.max(func.CASE([(subquery.r_month == '4', subquery.value)])).label('APR'),
                func.max(func.CASE([(subquery.r_month == '5', subquery.value)])).label('MAY'),
                func.max(func.CASE([(subquery.r_month == '6', subquery.value)])).label('JUN'),
                func.max(func.CASE([(subquery.r_month == '7', subquery.value)])).label('JUL'),
                func.max(func.CASE([(subquery.r_month == '8', subquery.value)])).label('AUG'),
                func.max(func.CASE([(subquery.r_month == '9', subquery.value)])).label('SEP'),
                func.max(func.CASE([(subquery.r_month == '10', subquery.value)])).label('OCT'),
                func.max(func.CASE([(subquery.r_month == '11', subquery.value)])).label('NOV'),
                func.max(func.CASE([(subquery.r_month == '12', subquery.value)])).label('DEC')
            )
            .outerjoin(subquery, subquery.sl == MISRawDataModel.sl)
            .filter(MISRawDataModel.r_year == r_year)
            .group_by(MISRawDataModel.sl)
            .order_by(MISRawDataModel.sl)
        )

        result = query.all()

        # Convert the result to a list of dictionaries
        data_list = [
            {
                'sl': row.sl,
                'particulars': row.particulars,
                'JAN': row.JAN,
                'FEB': row.FEB,
                'MAR': row.MAR,
                'APR': row.APR,
                'MAY': row.MAY,
                'JUN': row.JUN,
                'JUL': row.JUL,
                'AUG': row.AUG,
                'SEP': row.SEP,
                'OCT': row.OCT,
                'NOV': row.NOV,
                'DEC': row.DEC,
            }
            for row in result
        ]
        return [data_list,None]
    except Exception as e:
        print(f"An error occurred: {e}")
        return [None,e]
    finally:
        session.close()
