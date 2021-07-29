const router = require('koa-router')()
const db = require('./model/db.js')


/*================================= ERC20签名数据 ================================*/
router.get('/saveERC20ClaimData', async (ctx) => {
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


router.get('/getERC20ClaimData', async (ctx) => {
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



module.exports = router.routes()