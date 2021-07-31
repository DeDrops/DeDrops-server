const router = require('koa-router')();
const date = require("silly-datetime");
const utils = require('../../routes/tools/utils.js');
const config = require('../../conf/config.js');
const service = require('../service/service')
const sign = require('../../routes/tools/sign');
const db = require('../../routes/model/db.js');

// 查询地址资产
router.get('/assets', async (ctx) => {
	try {
		let address = ctx.query.address
		let assets = await ctx.service.chainlink.totalAssets(address)

		console.log(assets)
		ctx.body = {
			code: 0,
			msg: 'ok',
			data: assets
		}
	} catch (err) {
		ctx.body = { data: null, code: 1, msg: err.message }
	}
})

router.get('/checkNft', async (ctx) => {
	try {
		let address = ctx.query.address
		let id = ctx.query.id
		let resp = await ctx.service.verify.checkNftDrop(address, id)

		if (resp.match) {
			let body = {
				id: id,
				spender: address,
				deadline: new Date().getTime() + 1000000
			}
			resp.unsign = body	
			resp.sign = sign.signERC1155Claim(body)
		}
		ctx.body = {
			code: 0,
			msg: 'ok',
			data: resp
		}
	} catch (err) {
		ctx.body = { data: null, code: 1, msg: err.message }
	}
})

router.get('/checkToken', async (ctx) => {
	try {
		let address = ctx.query.address
		let id = ctx.query.id
		let resp = await ctx.service.verify.checkTokenDrop(address, id)
		let token = resp.drop.token

		let item = {
            token: token,
            owner: config.eth_account,
            spender: address,
			value: resp.value,
			match: resp.match
        }
		await db.save(db.Collections.erc20claims, item)

		if (resp.match) {
			let body = {
				token: token,
				owner: config.eth_account,
				spender: address,
				value: resp.value,
				deadline: new Date().getTime() + 1000000
			}
			resp.unsign = body
			resp.sign = sign.signERC20Claim(body)
		}
		ctx.body = {
			code: 0,
			msg: 'ok',
			data: resp
		}
	} catch (err) {
		ctx.body = { data: null, code: 1, msg: err.message }
	}
})

module.exports = router.routes();