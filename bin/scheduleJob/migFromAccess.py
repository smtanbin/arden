from bin.database.access_db import conn_access_db
from bin.database.models.ReportModels.MISRawDataModel import bulkAdd


def migFromAccess():
    sql = '''SELECT RIGHT('00' + CAST(sl AS VARCHAR(2)), 2) AS "SL",
      RIGHT('00' + CAST(r_month AS VARCHAR(2)), 2) AS "MONTH",
    r_year AS "YEAR",
    ISNULL(value, '0') AS "VALUE",
    (SELECT PARTICULAR FROM Arden.dbo.mis_particular mp WHERE mp.sl = md.sl) AS "Particulars"
    FROM Arden.dbo.mis_data md'''

    cbsRawData = conn_access_db(sql)
    # print("Raw Data:/>", cbsRawData)

    return_value = bulkAdd(cbsRawData)

    print("Raw Data:/>", return_value)
