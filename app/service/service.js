const eth = require('./eth')
const chainlink = require('./chainlink')

var _default = nil

export function load(ctx) {
    if (!_default) {
        _default = new Service(ctx)
    }
    return _default
}

export class Service {

    constructor(ctx) {
        this.ctx = ctx
        
        this.ctx.service = ctx.service || {}
        let name = this.constructor.name
        if (name.endsWith('Service')) {
            let cname = name.substring(0, name.length - 7).toLowerCase()
            this.ctx.service[cname] = this;
        }

        if (!this.ctx.service.eth) {
            this.ctx.service.eth = new eth(this.ctx)
        }
        if (!this.ctx.service.chainlink) {
            this.ctx.service.chainlink = new chainlink(this.ctx)
        }
    }

    get service() {
        return this.ctx.service
    }
}