from datetime import datetime, timedelta

from bin.blueprint.reports.models.CashReplenishment import CashReplenishment


def generate_mis(year):
        cash_replenishment = CashReplenishment()


        replenishment = cash_replenishment.getdata(year)

        if replenishment.get("error"):
            return {"error": replenishment["error"]}
        else:
            return replenishment

        return result
