import logging
from flask import Blueprint, request, jsonify

from bin.database.cbs import cbs_query

logger = logging.getLogger(__name__)

cbs_bp = Blueprint('cbs_bp', __name__)


@cbs_bp.route('/account_info/<account_no>', methods=['GET'])
def add_dispute_route(account_no):
    try:

        query = (f"SELECT A.CUSCOD CFID, A.CUSNMF || ' ' || A.CUSNML AC_NAME, B.ACTTIT ACCOUNTTITLE, NVL (A.MOBLNO, " \
                 f"A.TELENO) PHONE, A.MAILID EMAIL, A.ADDRS1 || ' ' || A.ADDRS2 || ' ' || A.ADDRS3 || ' ' || A.ADDRS4 " \
                 f"|| ' ' || A.CITYNM ADDRESS, B.BRANCD BRANCHCODE, TO_CHAR(a.CUSDOB, 'YYYY-MM-DD') DOB, A.GENDER, A.CUSNMG FATHERNAME, " \
                 f"A.CUSMNM MOTHERNAME, B.ACTYPE ACCCODE, B.CURBAL BALANCE, B.CURCDE CURRENCY, B.ACTNUM ACCOUNTNUMBER, b.ACSTAT, " \
                 f"B.OPRINS OPRTYPE FROM ISLBAS.STCUSMAS A, ISLBAS.STFACMAS B WHERE A.CUSCOD = B.CUSCOD AND B.ACTNUM = " \
                 f"'{account_no}' and B.ACSTAT not in ('CLS','TRF') and b.OPRINS  in ('SIN','AN1', 'EOS') and "
                 f"b.OPRINS NOT IN ('AN2','AN3','JNT') and b.OPRINS is not null")

        payload = cbs_query(query)
        return jsonify({"payload": payload, "error": None})

    except Exception as e:
        return jsonify({"payload": None, "error": str(e)}), 500


@cbs_bp.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Page not found"}), 404
