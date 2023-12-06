from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import toml

from bin.database.model import Base

with open('config.toml', 'r') as file:
    config = toml.load(file)

def database():
    global engine
    try:
        url = f'''mysql+pymysql://{config["database"]["username"]}:{config["database"]["password"]}@{config["database"]["address"]}/{config["database"]["database"]}'''
        engine = create_engine(url, echo=True)

        Base.metadata.create_all(engine)
    except SQLAlchemyError as e:
        print(f"Error creating database tables: {str(e)}")

    return sessionmaker(bind=engine)

def create_session():
    return database()()


