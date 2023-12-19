import pyodbc
import toml

with open('config.toml', 'r') as file:
    config = toml.load(file)


def conn_access_db(query):
    # Establish a connection
    connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={config["access"]["server"]};DATABASE={config["access"]["database"]};UID={config["access"]["username"]};PWD={config["access"]["password"]}'
    connection = pyodbc.connect(connection_string)

    # Create a cursor from the connection
    cursor = connection.cursor()

    try:
        # Execute the query
        cursor.execute(query)

        # Fetch the results
        results = cursor.fetchall()

        # Commit the transaction
        connection.commit()

        return results

    except Exception as e:
        # If an error occurs, rollback the transaction and print the error
        connection.rollback()
        print(f"Error executing query: {e}")
        raise RuntimeError(f"Error executing query: {e}")

    finally:
        # Close the cursor and connection
        cursor.close()
        connection.close()
