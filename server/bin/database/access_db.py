import pyodbc
import toml

with open('config.toml', 'r') as file:
    config = toml.load(file)


def conn_access_db(query):
    # Establish a connection
    connection_string = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={config["access"]["server"]};DATABASE={config["access"]["database"]};UID={config["access"]["username"]};PWD={config["access"]["password"]}'

    print('connection_string', connection_string)
    connection = pyodbc.connect(connection_string)

    # Create a cursor from the connection
    cursor = connection.cursor()

    try:
        # Execute the query
        cursor.execute(query)

        # Get column names (headers)
        headers = [column[0] for column in cursor.description]

        # Fetch the results
        results = cursor.fetchall()

        # Commit the transaction
        connection.commit()

        # Combine headers and data
        result_data = [{headers[i]: row[i] for i in range(len(headers))} for row in results]

        return result_data

    except Exception as e:
        # If an error occurs, rollback the transaction and print the error
        connection.rollback()
        print(f"Error executing query: {e}")
        raise RuntimeError(f"Error executing query: {e}")

    finally:
        # Close the cursor and connection
        cursor.close()
        connection.close()


def accessDB(query):
    try:
        results = conn_access_db(query)
        # Process the results or return them as needed
        return results
    except Exception as e:
        # Handle the error gracefully, log it, or re-raise it based on your requirements
        print(f"Error calling conn_access_db: {e}")
        # You can raise a custom exception or return an error message as needed
        raise RuntimeError(f"Error calling conn_access_db: {e}")
