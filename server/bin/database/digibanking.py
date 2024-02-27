import pyodbc
import toml

# Load database configuration from TOML file
with open('config.toml', 'r') as file:
    config = toml.load(file)

def mssql_conn():
    try:
        connection = pyodbc.connect(
            f"DRIVER=ODBC Driver 17 for SQL Server;"
            f"SERVER={config['mssql']['address']},{config['mssql']['port']};"
            f"DATABASE={config['mssql']['database']};"
            f"UID={config['mssql']['username']};"
            f"PWD={config['mssql']['password']}"
        )

        if connection.connected:
            print("Connected to MSSQL database")
            return connection

    except pyodbc.Error as err:
        print(f"Error: {err}")
        return None

def mssql(query, params=None):
    connection = mssql_conn()

    if connection is not None:
        try:
            cursor = connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            # Fetch the results if the query is a SELECT statement
            if query.strip().lower().startswith('select'):
                result = cursor.fetchall()
                return result
            else:
                connection.commit()
                print("Query executed successfully.")

        except pyodbc.Error as err:
            print(f"Error: {err}")

        finally:
            # Close the cursor and connection
            cursor.close()
            connection.close()
            print("Connection closed.")
