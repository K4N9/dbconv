const transaction = require('./transaction/transaction.js');

oracledb = require('oracledb');

module.exports = {
    handleRequest : async function(req, res) {
        res.writeHead(200, {"Content-Type" : "application/json"});
        let result = null;
        console.log(req.body);

        let connection;
        try {
            connection = await oracledb.getConnection();

            result = await transaction[req.body.transaction](req, res, connection);

            await connection.commit();

        } catch (err) {
            res.write("<p>Error: " + err + "</p>");
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            } 
        }
    
        console.log(result);
        if(result != null)
            res.write(JSON.stringify(result));
        res.end();
    }
}
