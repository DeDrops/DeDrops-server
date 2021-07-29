const router = require('koa-router')()
const db = require('./model/db.js')
const fs = require('fs')
const ethers = require('ethers')
const utils = ethers.utils
const BigNumber = ethers.BigNumber
const config = require('../conf/config.js')

//matic
var bank1155Address = '0xc44dc52e259352B6C26AfFcEf9ce280836AD6860'
var nftAddress = '0x27c6bA2d108E754805eACFD87e6394f75075f96c'
var DOMAIN_SEPARATOR_1155 = '0xa88c15decb7b31a157043f3cd4b8d44025fab8127a1ace79a4e42f4b4705550c'
var CLAIM_TYPEHASH_1155 = '0xb6a24ef5c5f68d9d0b21ed8a8f65af560e5c67ed6271d8c36130e21b56be877e'
var PASSWORD_TYPEHASH_1155 = '0x892bed353848c2d77daa7dec64601cc101e9d4dabd543a881719f8f210924128'


/*================================= NFT签名数据 ================================*/
router.get('/getNFTSignData', async (ctx) => {
    try {
        // let id = b(ctx.request.body.id)
        // let spender = ctx.request.body.spender
        // let deadline = b(ctx.request.body.deadline)

        //test
        let id = b(1)
        let owner = config.eth_account
        let spender = '0xE44081Ee2D0D4cbaCd10b44e769A14Def065eD4D'
        let deadline = b(1627457471)

        let digest = utils.keccak256(
            utils.solidityPack(
                ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
                [
                    '0x19',
                    '0x01',
                    DOMAIN_SEPARATOR_1155,
                    utils.keccak256(
                        utils.defaultAbiCoder.encode(
                            ['bytes32', 'address', 'uint256', 'address', 'address', 'uint256'],
                            [CLAIM_TYPEHASH_1155, nftAddress, id, owner, spender, deadline]
                        )
                    )
                ]
            )
        )
            
        let privateKey = '0x' + config.eth_privateKey
        let signingKey = new ethers.utils.SigningKey(privateKey)
        let sign = signingKey.signDigest(digest)
        let vrs = utils.splitSignature(sign)
        console.log(vrs)

        ctx.body = { data: vrs, code: 0, msg: 'success' }
    } catch (err) {
        ctx.body = { data: null, code: 1, msg: err.message }
    }
})



/*================================= ERC20签名数据 ================================*/
router.post('/saveERC20ClaimData', async (ctx) => {
    try {
        let obj = {}
        obj.token = ctx.request.body.token
        obj.owner = ctx.request.body.owner
        obj.spender = ctx.request.body.spender
        obj.value = ctx.request.body.value
        obj.deadline = ctx.request.body.deadline
        obj.v = ctx.request.body.v
        obj.r = ctx.request.body.r
        obj.s = ctx.request.body.s
        obj.digest = ctx.request.body.digest

        //test
        obj = {
            token: '0x55d398326f99059ff775485246999027b3197956',
            owner: '0xE44081Ee2D0D4cbaCd10b44e769A14Def065eD4D',
            spender: '0x37f88413AADb13d85030EEdC7600e31573BCa3c3',
            value: '1000000000000000000',
            deadline: 1627457471,
            v: 27,
            r: '0xd401b8281807cc9968cb4f0f7fec627a7362d8d65adbddffac7b3981377736d3',
            s: '0x38bc792a0bfb0c3748ced6da2b935297f1cbffcbe8da4ccace000bcbc2e8e497'
        }

        await db.saveERC20ClaimData(obj)

        ctx.body = { data: null, code: 0, msg: 'success' }
    } catch (err) {
        ctx.body = { data: null, code: 1, msg: err.message }
    }
})


router.post('/getERC20ClaimData', async (ctx) => {
    try {
        let obj = {}
        if (ctx.request.body.token) obj.token = ctx.request.body.token
        if (ctx.request.body.owner) obj.owner = ctx.request.body.owner
        if (ctx.request.body.spender) obj.spender = ctx.request.body.spender
        if (ctx.request.body.digest) obj.digest = ctx.request.body.digest

        //test
        obj.spender = '0x37f88413AADb13d85030EEdC7600e31573BCa3c3'

        let data = await db.getERC20ClaimData(obj)
        ctx.body = { data: data, code: 0, msg: 'success' }

    } catch (err) {
        ctx.body = { data: null, code: 1, msg: err.message }
    }
})


function b(num) {
    return BigNumber.from(num)
}

function n(bn) {
    return bn.toNumber()
}

function s(bn) {
    return bn.toString()
}



module.exports = router.routes()