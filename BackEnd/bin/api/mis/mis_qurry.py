from bin.database.cbs import cbs_query

class MIS:
    def __init__(self):
        pass

    def cash_replenishment(date):
        # input example cash_replenishment('01-JAN-2023')
        try:
            print(date)
            qurry = f'''select sum(jvlcamnt) value from islbas.sttrndtl where doctdate between '{date}' and LAST_DAY('{date}') and 
                Acctcode='10100-02' and refdocty is NULL and OPRSTAMP<>'ATMOPR' and dbcrcode='D' '''

            for result_row in cbs_query(qurry):
                return [result_row, None]


        except Exception as e:
            var = [None, f'''"error":{e}''']
            return var

    def sbl_atm_npsb_card(self):
        try:
            cbs_query()
        except Exception as e:
            var = [None, f'''"error":{e}''']
            return var
