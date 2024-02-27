from datetime import datetime
import logging
import os
import toml
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError, NoSuchTableError
from sqlalchemy.orm import sessionmaker, declarative_base

# Ensure the Log directory exists
log_directory = 'log'
os.makedirs(log_directory, exist_ok=True)

# Set up a JSONFormatter for the JSON log entries
formatter = logging.Formatter(
    '"timestamp":"%(asctime)s" ~ ["%(levelname)s"] =/> "%(message)s"')

# Set up SQLAlchemy logging
db_log_file_name = os.path.join(
    log_directory, f'{datetime.now().strftime("%Y")}_database_log.log')
db_handler = logging.FileHandler(db_log_file_name)
# Set the desired log level for the file handler
db_handler.setLevel(logging.DEBUG)
# Use the JSONFormatter for SQLAlchemy logs
db_handler.setFormatter(formatter)

db_logger = logging.getLogger('sqlalchemy')
db_logger.addHandler(db_handler)
db_logger.setLevel(logging.DEBUG)

# Rest of your code

Base = declarative_base()

with open('config.toml', 'r') as file:
    config = toml.load(file)


def create_database(engine, database_name):
    try:
        with engine.connect() as connection:
            connection.execute(text(f"CREATE DATABASE {database_name}"))
    except SQLAlchemyError as e:
        print(f"Error creating database {database_name}: {str(e)}")


def database():
    global engine
    try:
        # MSSQL connection URL
        url = f'mssql+pyodbc://{config["database"]["username"]}:{config["database"]["password"]}@{config["database"]["address"]}/{config["database"]["database"]}?driver=ODBC+Driver+17+for+SQL+Server'
        engine = create_engine(url, echo=False)

        # Check if the database exists
        try:
            Base.metadata.create_all(engine)
        except NoSuchTableError:
            create_database(engine, config["database"]["database"])
            # Re-create engine after creating the database
            engine = create_engine(url, echo=False)
            Base.metadata.create_all(engine)

    except SQLAlchemyError as e:
        print(f"Error creating database tables: {str(e)}")

    return sessionmaker(bind=engine)
