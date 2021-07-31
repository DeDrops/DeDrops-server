const Service = require('./service')
const ethers = require('ethers')
const config = require('../../conf/config.js')
const LinkABI = require('../../res/abi/Chainlink.json')
const BigNumber = ethers.BigNumber
const axios = require('axios')
const db = require('../../routes/model/db')


class NFTService extends Service {
    async check(address, nftId) {
        console.log('check:',address, nftId)
        let nft = await db.get(db.Collections.nft, {id: nftId})
        if (!nft || nft.length == 0) {
            throw new Error('nft not found')
        }
        nft = nft[0]
        let resp = {nft: nft, match: true}
        if (BigNumber.from(nft.rules.money).gt(0)) {
            let assets = await this.service.chainlink.totalAssets(address)
            resp.money = {
                assets: assets,
                match: BigNumber.from(assets.total).gte(nft.rules.money)
            }
            resp.match = resp.match && resp.money.match
        }
        if (nft.rules.actions && nft.rules.actions.length > 0) {
            resp.actions = {}
            for (let act of nft.rules.actions) {
                switch(act.key) {
                    case 'sushi-swap':
                        let count = await this.service.graph.sushiSwapCount(address)
                        resp.actions[act.key] = {
                            swap: count,
                            match: BigNumber.from(count).gte(act.count)
                        }
                        resp.match = resp.match && resp.actions[act.key].match
                    default:
                        resp.actions[act.key] = {
                            match: true
                        }
                }
            }
        }
        return resp
    }
}

module.exports = NFTService;