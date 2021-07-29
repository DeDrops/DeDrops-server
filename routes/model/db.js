const MongoClient = require('mongodb').MongoClient
const config = require('../../conf/config.js')


async function saveERC20ClaimData(obj) {
    let conn = null
    try {
        conn = await MongoClient.connect(config.db_url(), { useUnifiedTopology: true })
        let erc20claims = conn.db(config.db_name).collection('erc20claims')

        obj.time = Date.now()
        await erc20claims.deleteOne({ 'token': obj.token, 'owner': obj.owner, 'spender': obj.spender })
        await erc20claims.insertOne(obj)

        console.log('[db][saveERC20ClaimData]', obj)

    } catch (err) {
        console.log('[db][saveERC20ClaimData][ERROR]：' + err.message)
        throw err
    } finally {
        if (conn) conn.close()
    }
}


async function getERC20ClaimData(obj) {
    let conn = null
    try {
        conn = await MongoClient.connect(config.db_url(), { useUnifiedTopology: true })
        let erc20claims = conn.db(config.db_name).collection('erc20claims')

        let arr = await erc20claims.find(obj).toArray()
        return arr

    } catch (err) {
        console.log('[db][getERC20ClaimData][ERROR]：' + err.message)
        throw err
    } finally {
        if (conn) conn.close()
    }
}


module.exports = {
    saveERC20ClaimData: saveERC20ClaimData,
    getERC20ClaimData: getERC20ClaimData,
}