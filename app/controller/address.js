const router = require('koa-router')();
const date = require("silly-datetime");
const utils = require('../../routes/tools/utils.js');
const config = require('../../conf/config.js');
const service = require('../service/service')

// 查询地址资产
router.get('/address/assets', async (ctx) => {

	let address = ctx.query.address
	let assets = await ctx.service.chainlink.totalAssets(address)

	console.log(assets)
	ctx.body = {
		code: 0,
		msg: 'ok',
		data: assets
	}
})

// router.get('/address/assets', async (ctx) => {

// 	let address = ctx.query.address
// 	let assets = await ctx.service.chainlink.totalAssets(address)

// 	console.log(assets)
// 	ctx.body = {
// 		code: 0,
// 		msg: 'ok',
// 		data: assets
// 	}
// })

module.exports = router.routes();