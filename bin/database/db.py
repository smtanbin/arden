# import toml
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy import create_engine


# Base = declarative_base()

# with open('config.toml', 'r') as file:
#     config = toml.load(file)


# def database():
#     global engine
#     try:
#         # PostgresSQL connection URL
#         url = f'''postgresql+psycopg2://{config["database"]["username"]}:{config["database"]["password"]}@{config["database"]["address"]}/{config["database"]["database"]}'''

#         engine = create_engine(url, echo=False)
#         Base.metadata.create_all(engine)
#         engine.dispose()  # Commit and close the engine
#     except SQLAlchemyError as e:
#         print(f"Error creating database tables: {str(e)}")

#     return sessionmaker(bind=engine)


from datetime import datetime, timedelta
import logging
from logging.handlers import TimedRotatingFileHandler
import os
import toml
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import create_engine

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


def database():
    global engine
    try:
        # PostgresSQL connection URL
        url = f'''postgresql+psycopg2://{config["database"]["username"]}:{config["database"]["password"]}@{config["database"]["address"]}/{config["database"]["database"]}'''

        engine = create_engine(url, echo=False)
        Base.metadata.create_all(engine)
        engine.dispose()  # Commit and close the engine
    except SQLAlchemyError as e:
        print(f"Error creating database tables: {str(e)}")

    return sessionmaker(bind=engine)
