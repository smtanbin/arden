from datetime import datetime, timedelta
from bin.database.cbs import cbs_query

class CashReplenishment:
    def __init__(self):
        pass

    def query(self, date_str):
        try:
            # Convert the input date string to a datetime object
            date_obj = datetime.strptime(date_str, '%d-%b-%Y')

            # Calculate the end of the month
            end_of_month = date_obj.replace(day=1, month=date_obj.month + 1) - timedelta(days=1)

            # Your database query using date_obj and end_of_month
            query = f'''SELECT SUM(jvlcamnt) AS value
                           FROM islbas.sttrndtl
                           WHERE doctdate BETWEEN TO_DATE('{date_obj.strftime('%d-%b-%Y')}', 'DD-MON-YYYY') AND TO_DATE('{end_of_month.strftime('%d-%b-%Y')}', 'DD-MON-YYYY')
                           AND Acctcode='10100-02' AND refdocty IS NULL AND OPRSTAMP<>'ATMOPR' AND dbcrcode='D' '''

            # Assuming cbs_query is a function to execute the database query
            for result_row in cbs_query(query):
                return [result_row, None]

        except ValueError:
            return [None, "Invalid date format. Please use '01-JAN-2023' format."]

    def getdata(self, _year):
        result = []
        year = int(_year)

        for month in range(1, 13):
            # Create a date string in the format '01-JAN-2023' for each month
            date_str = datetime(year, month, 1).strftime('%d-%b-%Y')

            replenishment = self.query(date_str)

            if replenishment[1]:
                result.append({"error": replenishment[1]})
            else:
                result.append({
                    "MONTH": datetime(year, month, 1).strftime("%B %Y"),
                    "Cash Replenishment Amount": replenishment[0]["VALUE"]
                })

        return result
