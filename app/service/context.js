
const eth = require('./eth')
const chainlink = require('./chainlink')

var _ctx

function load (ctx) {
    if (!_ctx) {
        _ctx = ctx
        _ctx.service = ctx.service || {}
    }
    if (!_ctx.service.eth) {
        _ctx.service.eth = new eth(ctx)
    }
    if (!_ctx.service.chainlink) {
        _ctx.service.chainlink = new chainlink(ctx)
    }
    console.log('load service!')
    return _ctx
}

module.exports = {
    load: load
}