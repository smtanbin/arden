import toml
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from bin.database.model import Base

with open('config.toml', 'r') as file:
    config = toml.load(file)


def database():
    global engine
    try:
        # PostgresSQL connection URL
        url = f'''postgresql+psycopg2://{config["database"]["username"]}:{config["database"]["password"]}@{config["database"]["address"]}/{config["database"]["database"]}'''

        engine = create_engine(url, echo=True)
        Base.metadata.create_all(engine)
        engine.dispose()  # Commit and close the engine
    except SQLAlchemyError as e:
        print(f"Error creating database tables: {str(e)}")

    return sessionmaker(bind=engine)
