const Koa = require('koa')
const router = require('koa-router')()
const path = require('path')
const koaBody = require('koa-body')
const staticResource = require('koa-static')

var config = require('./conf/config.js')

const app = new Koa()


//配置静态web服务的中间件
app.use(staticResource(__dirname + '/static'))

app.use(koaBody({
	multipart: true,
	formidable: {
		maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
	}
}))

//处理跨域
app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('Access-Control-Allow-Headers', '*')
	ctx.set('Access-Control-Allow-Methods', '*')

	await next();
})

router.use('/sign', require('./routes/sign.js'))
router.use('/upload', require('./routes/upload.js'))
router.use('/', async ctx => {
	ctx.body = 'Hello World'
})

app.use(router.routes())   /*启动路由*/
app.use(router.allowedMethods())

app.listen(config.port)