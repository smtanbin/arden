from datetime import datetime, timedelta
from bin.database.cbs import cbs_query
from bin.database.models.ReportModels.MISRawDataModel import insertNotDuplicate


def misJob():
    now = datetime.now()
    # Calculate the first day of the previous month
    first_day_of_month = datetime(now.year, now.month, 1) - timedelta(days=1)
    first_day_of_previous_month = datetime(first_day_of_month.year, first_day_of_month.month, 1)

    # Extract the month and year of the previous month
    previous_month = first_day_of_previous_month.month
    previous_year = first_day_of_previous_month.year

    # Calculate the last day of the previous month
    last_day_of_previous_month = first_day_of_month.replace(hour=23, minute=59, second=59)

    from_date = first_day_of_previous_month.strftime("%d-%b-%Y")
    to_date = last_day_of_previous_month.strftime("%d-%b-%Y")

    sql = '''SELECT '04' AS "SL",'Total No. of Transactions at SBL ATMs' AS "Particulars",COUNT (*) AS "VALUE" FROM 
    atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND message_types IN ( 
    '0200', '0205' ) AND merchant_type IN ( '0000', '0005' ) UNION SELECT '06' AS "SL",'Total Cash Withdrawal Amount 
    at SBL ATMs' AS "Particulars",SUM (kpi_value) FROM (SELECT SUM (CASE WHEN process_code = '01' THEN b_tramount 
    END) KPI_VALUE FROM atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND 
    message_types = '0200' AND merchant_type IN ( '0000' )) UNION SELECT '05' AS "SL",'Total Cash Replenishment 
    Amount at SBL ATMs' AS "Particulars",SUM (jvlcamnt) AS "VALUE" FROM islbas.sttrndtl WHERE doctdate BETWEEN 
    :FROMDATE AND :TODATE AND acctcode = '10100-02' AND refdocty IS NULL AND oprstamp <> 'ATMOPR' AND dbcrcode = 'D' 
    UNION SELECT '07' AS "SL",'Total No of Transactions (SBL Card at SBL ATMs)' AS "Particulars",COUNT (*) AS "Value" 
    FROM atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND message_types = 
    '0200' AND merchant_type IN ( '0000' ) UNION SELECT '11' AS "SL",'Total No. of Transactions (NPSB Cards at SBL 
    ATMs)' AS "DATA",SUM (no_of_txn) AS "NO_OF_TR" FROM (SELECT B.terminal_id || '-' || B.names AS ATM,COUNT (*) AS 
    NO_OF_TXN FROM atmutl.atmutility A right outer join (SELECT terminal_id,names FROM atmutl.lk_terminal WHERE 
    mercode = '0000' AND actflg = 'Y') B ON A.terminal_id = B.terminal_id AND A.acqins_id IN ( '61000000000', 
    '000210' ) AND A.procdate BETWEEN :FROMDATE AND :TODATE AND A.b_rescode = '00' AND A.message_types = '0205' AND 
    A.merchant_type IN ( '0005' ) AND A.process_code = '01' GROUP BY B.terminal_id || '-' || B.names) UNION SELECT 
    '12' AS "SL",'Total Cash Withdrawal Amount (NPSB Cards at SBL ATMs)' AS "DATA",SUM (amount) AS "AMOUNT_OF_CARD" 
    FROM (SELECT B.terminal_id || '-' || B.names AS ATM,SUM (b_tramount) AS AMOUNT FROM atmutl.atmutility A right 
    outer join (SELECT terminal_id,names FROM atmutl.lk_terminal WHERE mercode = '0000' AND actflg = 'Y') B ON 
    A.terminal_id = B.terminal_id AND A.acqins_id IN ( '61000000000', '000210' ) AND A.procdate BETWEEN :FROMDATE AND 
    :TODATE AND A.b_rescode = '00' AND A.message_types = '0205' AND A.merchant_type IN ( '0005' ) AND A.process_code 
    = '01' GROUP BY B.terminal_id || '-' || B.names) UNION SELECT '08' AS "SL",'Total Withdrawal Amount (SBL Card at 
    SBL ATMs)' AS "Particulars",SUM (CASE WHEN process_code = '01' THEN b_tramount END) AS "Value" FROM 
    atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND message_types = '0200' 
    AND merchant_type IN ( '0000' ) UNION SELECT '09' AS "SL",'Total No. of Transactions (SBL Card at NPSB ATMs)' AS 
    "Particulars",COUNT (*) KPI_VALUE FROM atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND 
    b_rescode = '00' AND message_types = '0200' AND merchant_type IN ( '0005' ) UNION SELECT '10' AS "SL",'Total Cash 
    Withdrawal Amount (SBL Card at NPSB ATMs)' AS "Particulars",SUM (CASE WHEN process_code = '01' THEN b_tramount 
    END) KPI_VALUE FROM atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND 
    message_types = '0200' AND merchant_type IN ( '0005' ) UNION SELECT '52' AS "SL",'Total No. of Accounts 
    Facilitated with SMS Banking' AS "Particulars",SUM (V52.actnum) AS "VALUE" FROM (SELECT brancd,COUNT (DISTINCT 
    actnum) AS ACTNUM FROM islbas.stfacmas WHERE acstat NOT IN ( 'TRF', 'CLS' ) AND opndat <= :TODATE AND cuscod IN (
    SELECT cuscod FROM smsgtway.mobile_master WHERE actflg = 'Y' AND NVL (actdte, :TODATE) <= :TODATE) AND SUBSTR (
    actype, 1, 1) IN ( 'S', 'D', 'I', 'C' ) AND brancd NOT IN ( '100', '101', '102', '105', '108', '110', 
    '111' ) GROUP BY brancd) V52 UNION /* 4. Internet Banking Transaction Report */ SELECT '46' AS "SL",'No. of Fund 
    Transfer by Internet Banking' AS "Particulars",COUNT (*) AS "VALUE" FROM islbas.stfetran WHERE docdat BETWEEN 
    :FROMDATE AND :TODATE AND doctyp = 'WB' AND oprcod = 'WWL' UNION SELECT '47' AS "SL",'Fund Transfer Amount by 
    Internet Banking' AS "Particulars",ROUND (SUM (dbamlc), 0) AS "VALUE" FROM islbas.stfetran WHERE docdat BETWEEN 
    :FROMDATE AND :TODATE AND doctyp = 'WB' AND oprcod = 'WWL' UNION SELECT '45' AS "SL",'Total No. of Accounts With 
    Internet Banking' AS "Particulars",SUM (actnum) FROM (SELECT brancd,COUNT (DISTINCT cuscod) CUSCOD,
    COUNT (DISTINCT actnum) ACTNUM FROM islbas.stfacmas WHERE acstat NOT IN ( 'TRF', 'CLS' ) AND cuscod IN (SELECT 
    cuscod FROM mybank.stmailid WHERE logintotal > 1) AND TRUNC (timstamp) <= :TODATE AND SUBSTR (actype, 1, 
    1) IN ( 'S', 'D', 'I', 'C' ) AND brancd NOT IN ( '100', '101', '102', '105', '108', '110', '111' ) GROUP BY 
    brancd) UNION SELECT '48' AS "SL",'No. of Mobile Recharge by Internet Banking' AS "p",COUNT (*) AS TOTAL FROM 
    mybank.stmobile_recharge_ssl WHERE TRUNC (timstamp) BETWEEN :FROMDATE AND :TODATE AND status = 'R' UNION SELECT 
    '49' AS "SL",'Amount of Mobile Recharge by Internet Banking' AS "p",SUM (amount) AS RECHARGE_AMOUNT_IBANKING FROM 
    mybank.stmobile_recharge_ssl WHERE TRUNC (timstamp) BETWEEN :FROMDATE AND :TODATE AND status = 'R' UNION SELECT 
    '50' AS "SL",'Mobile Recharge Income by Internet Banking' AS "p",SUM (commission) AS TOTAL_COMMISSION /* -- Added 
    an alias to the SUM expression*/ FROM (SELECT SUBSTR (mobileno, -11, 3) AS MOBILE_PREFIX,SUM (amount) - SUM (
    ssl_payable) AS COMMISSION,SUM (ssl_payable) AS SSL_PAYABLE,SUM (amount) AS AMOUNT FROM (SELECT amount,
    CASE WHEN SUBSTR (mobileno, -11, 3) = '017' THEN amount - ROUND (amount * 1 / 100, 2) WHEN SUBSTR (mobileno, -11, 
    3) = '013' THEN amount - ROUND (amount * 1 / 100, 2) WHEN SUBSTR (mobileno, -11, 3) = '019' THEN amount - ROUND (
    amount * 1.125 / 100, 2) WHEN SUBSTR (mobileno, -11, 3) = '014' THEN amount - ROUND (amount * 1.125 / 100, 
    2) WHEN SUBSTR (mobileno, -11, 3) = '015' THEN amount - ROUND (amount * 1.35 / 100, 2) WHEN SUBSTR (mobileno, 
    -11, 3) = '018' THEN amount - ROUND (amount * 1.295 / 100, 2) WHEN SUBSTR (mobileno, -11, 3) = '011' THEN amount 
    - ROUND (amount * 1.80 / 100, 2) WHEN SUBSTR (mobileno, -11, 3) = '016' THEN amount - ROUND (amount * 1.465 / 
    100, 2) END AS SSL_PAYABLE,mobileno FROM mybank.stmobile_recharge_ssl WHERE TRUNC (timstamp) BETWEEN :FROMDATE 
    AND :TODATE AND status = 'R') GROUP BY SUBSTR (mobileno, -11, 3)) UNION SELECT '20' AS "SL",'Total No. of Branch 
    POS Transaction' AS "parti",COUNT (*) FROM atmutl.atmutility WHERE procdate BETWEEN :FROMDATE AND :TODATE AND 
    b_rescode = '00' AND message_types IN ( '0200', '0100' ) AND merchant_type IN ( '0011' ) UNION SELECT '21' AS 
    "SL",'Amount Branch POS Transaction' AS "parti",SUM (b_tramount) Kpi_Value FROM atmutl.atmutility WHERE procdate 
    BETWEEN :FROMDATE AND :TODATE AND b_rescode = '00' AND message_types IN ( '0200', '0100' ) AND merchant_type IN ( 
    '0011' ) ORDER BY 1'''

    cbsRawData = cbs_query(sql, (from_date, to_date))

    return_value = insertNotDuplicate(previous_year , previous_month, cbsRawData)

    print(return_value)
