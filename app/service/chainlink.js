const Service = require('./service')
const ethers = require('ethers')
const config = require('../../conf/config.js');
const LinkABI = require('../../res/abi/Chainlink.json')
const BigNumber = ethers.BigNumber


class LinkService extends Service {
    _tokens() {
        let tokens = []
        for (let t in Config.chainlink) {
            tokens.push(t)
        }
        return tokens
    }
    
    async getPrice(token) {
        let addr = config.chainlink[token]
        let contract = this.service.eth.getContract(addr, LinkABI)
        let decimals = await contract.decimals()
        // update time
        // let timestamp = await contract.latestTimestamp()
        let price = await contract.latestAnswer()
        return new BigNumber(price).div(new BigNumber(10).pow(decimals)).toString(10)
    }

    async totalAssets(address) {
        let assets = {
            total: '0',
        }
        let tokens = this._tokens()
        for (let token of tokens) {
            let price = await this.getPrice(token)
            let balacne = await this.service.eth.balacneOf(address, token)
            assets[token] = {
                price: price,
                balacne: balacne,
            }
            assets.total = new BigNumber(balacne).times(price).add(assets.total).toString(10)
        }
        return assets
    }
}

module.exports = LinkService;