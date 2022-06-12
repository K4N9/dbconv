const basics = require('./basics.js');

module.exports = {
    "lookUp" : async function(req, res, connection){
        let body = req.body;
        let result = await basics.select(connection, body.tableName, body.col, body.condition);
        return result;
    },

    "lookUpAll" : async function(req, res, connection){
        let body = req.body;
        let result = await basics.select(connection, body.tableName, body.col, "*");
        return result;
    },

    "reqDebug" : async function(req, res, connection)
    {
        let result = (await basics.select(connection, "user_tables", "TABLE_NAME", "*")).rows;
        console.log(result);
        result = await result.map((element, index)=> [index, element[0]]);

        console.log(result);
        let result2 = [];
        for await(const element of result){
            result2= [...result2, await basics.select(connection, element[1], "*", "*")]; 
        }

        console.log(result2[0]);
        result = [result, result2]
        return result;
    },

    "debug" : async function(req, res, connection, tableName, col, condition){
        let result = await basics.select(connection, tableName, col, condition);
        return result;
    },

    // 
    "open" : async function(req, res, connection){
        let body = req.body;
        await basics.insert(connection, "STORE_TB (STORE_NO, STORE_NM, STORE_ADR, PHONE_NO, STORE_SIZE, CASH_SM)", ["STORE_SEQ.NEXTVAL", body.storenm, body.storeadr,  body.phoneno,  body.storesize, 0]);
    },

    "reqReqruit" : async function(req, res, connection){
        let result = (await basics.select(connection, "STORE_TB", "STORE_NO, STORE_NM", "*")).rows;
        result = [result, (await basics.select(connection, "CODE_TB", "CODE_NO, CODE_NM", "CODE_DIST_NO = 1")).rows];
        return result;
    },
    
    "reqruit" : async function(req, res, connection){
        let body = req.body;
        await basics.insert(connection, "EMPLOYEE_TB (EMPLOYEE_NO, EMPLOYEE_NM, EMPLOYEE_ADR, PHONE_NO, PERSONAL_NO)", ["EMPLOYEE_SEQ.NEXTVAL", body.employeenm, body.employeeadr, body.phoneno, body.personalno]);
        await connection.commit();
        let no = (await basics.select(connection, "(SELECT * FROM EMPLOYEE_TB ORDER BY EMPLOYEE_NO DESC)", "EMPLOYEE_NO", "ROWNUM = 1")).rows[0][0];
        
        await basics.insert(connection, "MANAGE_TB (MANAGE_DT, EMPLOYEE_NO, STORE_NO, GO_TM, LEAVE_TM, EMPLOYEE_WAGE, POSITION_CD)", ["SYSDATE", String(no), body.storeno, body.gotm, body.leavetm, body.employeewage, body.positioncd]);
        
    },

    "reqFire" : async function(req, res, connection) {
        let result = (await basics.select(connection, "EMPLOYEE_TB", "EMPLOYEE_NO, EMPLOYEE_NM", "*")).rows;
        return result;
    },

    "fire" : async function(req, res, connection) {
        let body = req.body;
        await basics.delete(connection, "MANAGE_TB", "EMPLOYEE_NO = " + body.employeeno);
        await basics.delete(connection, "EMPLOYEE_TB", "EMPLOYEE_NO = " + body.employeeno);
    },

    "reqChangeStore" : async function(req, res, connection) {
        let result = (await basics.select(connection, "EMPLOYEE_TB", "EMPLOYEE_NO, EMPLOYEE_NM", "*")).rows;
        result = [...result, (await basics.select(connection, "STORE_TB", "STORE_NO, STORE_NM", "*")).rows];
        return result;
    },

    "changeStore" : async function(req, res, connection) {
        let body = req.body;
        await basics.update(connection, "MANAGE_TB", "MANAGE_DT = SYSDATE, STORE_NO = " + body.storeno, "EMPLOYEE_NO = " + body.employeeno);
    },

    "reqChangePosition" : async function(req, res, connection) {
        let result = (await basics.select(connection, "EMPLOYEE_TB", "EMPLOYEE_NO, EMPLOYEE_NM", "*")).rows;
        result = [...result, (await basics.select(connection, "CODE_TB", "CODE_NO, CODE_NM", "CODE_DIST_NO = 2")).rows];
        return result;
    },

    "changePostiion" : async function(req, res, connectino) {
        let body = req.body;
        await basics.update(connection, "MANAGE_TB", "MANAGE_DT = SYSDATE, POSITION_CD = " + body.positioncd, "EMPLOYEE_NO = " + body.employeeno);
    },

    "reqChangeTime" : async function(req, res, connection) {
        return [(await basics.select(connection, "EMPLOYEE_TB", "EMPLOYEE_NO, EMPLOYEE_NM", "*")).rows];
    },

    "changeTime" : async function(req, res, connection) {
        let body = req.body;
        await basics.update(connection, "MANAGE_TB", "MANAGE_DT = SYSDATE, GO_TM = " + body.gotm + ", LEAVE_TM = " + body.leavetm, "EMPLOYEE_NO = " + body.employeeno);
    },

    "reqChangeTime" : async function(req, res, connection) {
        return [(await basics.select(connection, "EMPLOYEE_TB", "EMPLOYEE_NO, EMPLOYEE_NM", "*")).rows];
    },

    "changeWage" : async function(req, res, connection) {
        let body = req.body;
        await basics.update(connection, "MANAGE_TB", "MANAGE_DT = SYSDATE, EMPLOYEE_WAGE = " + body.employeewage, "EMPLOYEE_NO = " + body.employeeno);
    },

    "requestStock" : async function(req, res, connection){
        let result = await basics.direct(connection, "select cmd.COMMODITY_NM, cmd.COMMODITY_NO, cmd.COMMODITY_PRICE, etp.EVENT_NM, evt.START_DT, evt.END_DT, st.STOCK_DT, st.STOCK_AMT\
        from COMMODITY_TB cmd, EVENT_TB evt, EVENT_TYPE_TB etp, STOCK_TB st\
    where cmd.COMMODITY_NO =evt.COMMODITY_NO(+) and evt.EVENT_NO = etp.EVENT_NO(+) and cmd.COMMODITY_NO = st.COMMODITY_NO and st.STORE_NO = " + 1); // 지점번호 1로해둠
        result = [result, (await basics.select(connection, "STORE_TB", "STORE_NO, STORE_NM", "*")).rows];
        result = [...result, (await basics.select(connection, "CODE_TB", "CODE_NO, CODE_NM", "CODE_DIST_NO = 2")).rows];
        return result;
    },

    "pay" : async function(req, res, connection){
        let body = req.body;


        (await basics.insert(connection, "PAY_TB (PAY_NO, STORE_NO, PAY_TYPE_CD, CARD_NO, PAY_PRICE, PAY_DT)", ["PAY_SEQ.NEXTVAL", body.storeno, body.paytypecd, body.cardno, body.payprice, "SYSDATE"]));
        
        (await connection.commit());
        
        let no = (await basics.select(connection, "(SELECT * FROM PAY_TB ORDER BY PAY_NO DESC)", "PAY_NO", "ROWNUM = 1"));

        
        no = no.rows[0][0];
        for await (const current of body.commodity){
            await basics.insert(connection, "PAY_STOCK_TB (COMMODITY_NO, PAY_NO, STOCK_DT, STORE_NO, PAY_STOCK_AMT)", [current.commodityno, String(no), "to_timestamp('" + String(current.stockdt) + "', 'YYYY-MM-DD\"T\"HH24:MI:SS.ff3\"Z\"')", body.storeno, current.paystockamt]);
            await basics.update(connection, "STOCK_TB", "STOCK_AMT = STOCK_AMT - " + current.paystockamt, "COMMODITY_NO = " + current.commodityno + " and STOCK_DT = to_timestamp('" + current.stockdt + "', 'YYYY-MM-DD\"T\"HH24:MI:SS.ff3\"Z\"') and STORE_NO = " + body.storeno);
        }

        if (body.paytypecd == 201) {
            await basics.update(connection, "STORE_TB", "CASH_SM = CASH_SM + " + body.payprice, "STORE_NO = " + body.storeno);
        }
    },

    "reqRefund" : async function(req, res, connection) {
        let body = req.body;
        let result = [(await basics.select(connection, "PAY_TB", "*", "PAY_NO = " + body.payno))];
        result = [...result, (await basics.select(connection, "PAY_STOCK_TB", "*", "PAY_NO = " + body.payno))];
        return result;
    },

    "refund" : async function(req, res, connection) {
        let body = req.body;

        let paytype = (await basics.select(connection, "PAY_TB", "PAY_PRICE", "PAY_NO = " + body.payno)).rows[0][0];
        if(paytype == 201)
        {
            let price = (await basics.select(connection, "PAY_TB", "PAY_PRICE", "PAY_NO = " + body.payno)).rows[0][0];
            let storeno = (await basics.select(connection, "PAY_TB", "STORE_NO", "PAY_NO = " + body.payno)).rows[0][0];
            await basics.update(connection, "STORE_TB", "CASH_SM = CASH_SM - " + price, "STORE_NO = " + storeno);
        }

        let tmp = await basics.select(connection, "PAY_STOCK_TB", "*", "PAY_NO = " + body.payno);

        for await (const current of tmp.rows) {
            await basics.update(connection, "STOCK_TB", "STOCK_AMT = STOCK_AMT + " + current[1], "STOCK_DT = TO_DATE('" + current[3].toISOString().substring(0,10) + "', 'YYYY-MM-DD') and STORE_NO = " + current[4] + " and COMMODITY_NO = " + current[2]);
        }

        await basics.delete(connection, "PAY_STOCK_TB", "PAY_NO = " + body.payno);
        await basics.delete(connection, "PAY_TB", "PAY_NO = " + body.payno);
        return null;
    },

    "designEvent" : async function(req,res, connection) {
        let body= req.body;

        await basics.insert(connection, "EVENT_TYPE_TB (EVENT_NO, EVENT_NM)", ["EVENT.SEQ_NEXTVAL", body.eventnm]);
    },

    "reqMakeEvent" : async function(req, res, connection) {
        let result = (await basics.select(connection, "EVENT_TYPE_TB", "EVENT_NO, EVENT_NM", "*")).rows;
        result = [...result, (await basics.select(connection, "COMMODITY_TB", "COMMODITY_NO, COMMODITY_NM", "*")).rows];
        return result;
    },

    "MakeEvent" : async function(req, res, connection) {
        let body = req.body;
        await basics.insert(connection, "EVENT_TB (EVENT_NO, COMMODITY_NO, START_DT, END_DT)", [body.eventno, body.commodityno, body.startdt, body.enddt]);
    },

    "reqUpdateEventNo" : async function(req, res, connection) {
        let result = (await basics.select(connection, "EVENT_TYPE_TB", "EVENT_NO, EVENT_NM", "*")).rows;
        result = [...result, (await basics.select(connection, "COMMODITY_TB", "COMMODITY_NO, COMMODITY_NM", "*")).rows];
        return result;
    },

    "updateEventNo" : async function(req, res, connection){
        let body = req.body;
        await basics.update(connection, "EVENT_TB", "EVENT_NO = " + body.eventno, "COMMODITY_NM = ", body.commoditynm);
    },

    "reqUpdateEventPeriod" : async function(req, res, connection) {
        let result = (await basics.select(connection, "COMMODITY_TB", "COMMODITY_NO, COMMODITY_NM", "*")).rows;
        return result;
    },

    "UpdateEventPeriod" : async function(req, res, connection) {
        let body = req.body;
        await basics.update(connection, "EVENT_TB", "START_DT = " + body.startdt + ", END_DT = " + body.enddt, "COMMODITY_NM = ", body.commoditynm);
    },

    "discard" : async function(req, res, connection) {
        await basics.direct(connection, "insert into DISCARD_TB (STORE_NO, COMMODITY_NO, STOCK_DT, DISCART_AMT)\
        select STORE_NO, COMMODITY_NO, STOCK_DT, STOCK_AMT from STOCK_TB\
        where STOCK_DT = SYSDATE\
        ");

        await basics.direct(connection, "update STOCK_TB\
        set STOCK_AMT = 0\
    where COMMODITY_DT = SYSDATE;\
    ");
    },

    // 보류
    // "correct" : async function(req, res, connection) {
    //     let body = req.body;
    //     // await basics.update(connection, "STOCK_TB", "STOCK_AMT = " + req.body, "STORE_NO = " + body. +
    //     //  ", COMMODITY_NO = " + body. + ", STOCK_DT = " + body.);
        
    //     // await basics.update(connection, "STORE_TB", "CASH_SM = " + body., "STORE_NO = " + body.);
    // },

    "reqMakeOrder" : async function(req, res, connection) {
        let result = (await basics.select(connection, "COMMODITY_TB", "COMMODITY_NO, COMMODITY_NM", "*"));
        result = [result, (await basics.select(connection, "STORE_TB", "STORE_NO, STORE_NM", "*")).rows];
        return result;
    },

    "makeOrder" : async function(req, res, connection) {
        let body= req.body;
        for await(let content of body.list){
            await basics.insert(connection, "COMMODITY_ORDER_TB (ORDER_DT, STORE_NO, COMMODITY_NO, ORDER_AMT)", ["SYSDATE", body.storeno, content.commodityno, content.orderamt]);
        }
        return null;
    },

    "reqTakeStock" : async function(req, res, connection) { 
        let result = (await basics.select(connection, "COMMODITY_ORDER_TB", "STORE_NO, COMMODITY_NO, ORDER_AMT", "*"));
        return result;
    },

    "takeStock" : async function(req, res, connection) {
        let body = req.body;
        for await(let content of body.contents){
            await basics.insert(connection, "STOCK_TB (STOCK_DT, STORE_NO, COMMODITY_NO, STOCK_AMT)", ["SYSDATE + 1", content.storeno, content.commodityno, content.orderamt]);
        }
    },

    "aggregate" : async function(req, res, connection) {
        await basics.direct(connection, "insert into DAY_SALES_TB (SALES_DT, STORE_NO, SALES_SM)\
        select to_char(PAY_DT), STORE_NO, sum(PAY_PRICE) from PAY_TB where to_char(pay_dt) = to_char(SYSDATE)\
        group by to_char(PAY_DT), STORE_NO\
    ");
    },

    "reqAddCommodity" : async function(req, res, connectino) {
        let result = (await basics.select(connection, "CODE_TB", "CODE_NO, CODE_NM", "CODE_DIST_NO = 3"));
        return result;
    },

    "addCommodity" : async function(req, res, connection) {
        let body = req.body;
        await basics.insert(connection, "COMMODITY_TB (COMMODITY_NO, COMMODITY_NM, COMMODITY_PRICE, CATEGORY_CD)", ["COMMODITY_SEQ.NEXTVAL", body.commoditynm, body.commodityprice, body.categorycd]);
    }
    // 보류
    // "removeCommodity" : async function(req, res, connection) {
    //     let body = req.body;
    //     await basics.insert(connection, "COMMODITY_TB (COMMODITY_NO, COMMODITY_NM, COMMODITY_PRICE, CATEGORY_CD)", ["COMMODITY_SEQ.NEXTVAL", body.commoditynm, body.commodityprice, body.categorycd]);
    // }
}