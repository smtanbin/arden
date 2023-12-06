# AuthorizedSlip.py

from bin.database.access_db import conn_access_db


class AuthorizedSlip:
    def __init__(self):
        pass

    def add_data(self, account_number):

        results = conn_access_db(
            f'''select PAN from CPSStandardBank.dbo.Account where Acct_Number = "{account_number}"''')

        # for row in results:
        #     print(row)
        print(results)
        return results
