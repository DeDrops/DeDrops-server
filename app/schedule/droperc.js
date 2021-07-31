const config = require('../../conf/config.js');
const Subscription = require('./subscription')
const DropABI = require('../../res/abi/DeDropsERC.json').abi
const db = require('../../routes/model/db')
const ethers = require('ethers')
const BigNumber = ethers.BigNumber

class DropERC extends Subscription {

    get schedule() {
        // Execute a cron job every 1 Minutes 
        // return '*/1 * * * *'
        return '*/10 * * * * * '
    }

    async subscribe() {
        // console.log('drop nft subscribe')
        if (!this.isWatching) {
            const ctx = this
            console.log('watching erc drop.')
            this.isWatching = true

            try {
                let addr = config.polygon.contract.drop_erc
                console.log('contract', addr)
                let contract = this.service.polygon.getContract(addr, DropABI)

                contract.on('Drop', (id, token, amount, info, info2) => {
                    // console.log('drop erc event:', id, token, amount, info, info2)
                    ctx.handleEvent(id.toString(), token, amount.toString(), JSON.parse(info), JSON.parse(info2))
                })
            } catch (e) {
                this.isWatching = false
                console.log(e)
            }
        }

        // let info = {
        //     "name":"DEFI韭菜勋章",
        //     "imgUrl":"https://i2.hhbkg.com/img/3105/fiuigydbujp.jpg",
        //     "desc":"不卖！不卖！就是不卖！",
        //     "nftCount":"99",
        // }
        // let rules = {"actions":[{"key":"sushi-swap","count":"1"},{"key":"gitcoin-grant","count":"1"}],"money":0}
        // this.handleEvent('1', '0xA93a1B78Fb909073BD721FCb5892CDCe067A612C','100', info, rules)
    }

    async handleEvent(id, token, amount, info, info2) {
        await db.deleteObj(db.Collections.erc20, {id: id})
        let item = {
            id: id,
            token: token,
            amount: amount,
            info: info,
            rules: info2
        }
        console.log('drop token event:', item)
        await db.save(db.Collections.erc20, item)
    }
}

module.exports = DropERC