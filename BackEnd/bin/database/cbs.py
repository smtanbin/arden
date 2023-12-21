import cx_Oracle
import toml

with open('config.toml', 'r') as file:
    config = toml.load(file)


def cbs_query(query, bind_vars=None):
    try:
        connection = cx_Oracle.connect(config["cbs"]["username"], config["cbs"]["password"],config["cbs"]["url"])
        cursor = connection.cursor()

        if bind_vars:
            result = cursor.execute(query)
        else:
            result = cursor.execute(query)
        rows = result.fetchall()
        column_names = [desc[0] for desc in cursor.description]  # Get column names

        cursor.close()
        connection.close()

        if rows:
            json_results = []
            for row in rows:
                json_row = {}
                for i, value in enumerate(row):
                    json_row[column_names[i]] = value
                json_results.append(json_row)
                print(json_results)
            return json_results
        else:
            return None

    except cx_Oracle.Error as e:
        print(f"Oracle Error: {e}")
        raise ValueError(f"Oracle Error: {e}")

