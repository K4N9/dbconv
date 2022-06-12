// db에 명령어를 전달, 수행하고 커밋하며 반환값을 적절히 조합해 react에 전달한다.
oracledb = require('oracledb');

module.exports = {
    // 문자열 tableName입력받고 Select문 실행 및 결과 반환
    select : async function(connection, tableName, col, condition){
        var result;
        if(condition == '*'){
            console.log("select {1} from {0}".format(tableName, col));
            result = await connection.execute("select {1} from {0}".format(tableName, col));
        }
        else{
            console.log("select {1} from {0} where {2}".format(tableName, col, condition));
            result = await connection.execute("select {1} from {0} where {2}".format(tableName, col, condition));
        }
        return result;
    },

    // 문자열 tableName, Json.parse(json) Object values를 입력받고 insert 수행
    insert : async function(connection, tableName, values)
    {
        console.log("insert into {0} values ({1})".format(tableName, JSON.stringify(values).slice(1, -1).replaceAll("\"", "'").replaceAll(/'[A-Z_.]+VAL'|'SYSDATE[ +0-9]*'|'to_timestamp\(.+\)'/g, replaceWith).replaceAll(/\\\'T\\\'/g, "\"T\"").replaceAll(/\\\'Z\\\'/g, "\"Z\"")));
        await connection.execute("insert into {0} values ({1})".format(tableName, JSON.stringify(values).slice(1, -1).replaceAll("\"", "'").replaceAll(/'[A-Z_.]+VAL'|'SYSDATE[ +0-9]*'|'to_timestamp\(.+\)'/g, replaceWith).replaceAll(/\\\'T\\\'/g, "\"T\"").replaceAll(/\\\'Z\\\'/g, "\"Z\"")));
    },

    delete : async function(connection, tableName, condition)
    {
        console.log("delete from {0} where {1}".format(tableName, condition));
        await connection.execute("delete from {0} where {1}".format(tableName, condition));
    },
    
    update : async function(connection, tableName, set, condition)
    {
        console.log("update {0} set {1} where {2}".format(tableName, set, condition));
        await connection.execute("update {0} set {1} where {2}".format(tableName, set, condition));
    },

    direct : async function (connection, query)
    {
        var result;
        result = await connection.execute(query);
        return result;
    }
}

String.prototype.format = function() {
    var formatted = this;
    for(var i = 0;i< arguments.length;i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp , arguments[i]);
    }
    return formatted;
};

function replaceWith(match)
{
    return match.slice(1, -1);
}