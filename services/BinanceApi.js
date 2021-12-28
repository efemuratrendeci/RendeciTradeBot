const ccxt = require('ccxt');

class BinanceApi {
    constructor() {
        this.#api = new ccxt.binance({ apiKey: process.env.BN_API_KEY, secret: process.env.BN_API_SECRET });
    }
    #api;

    getFreeBalance = async () => {
        this.balance = await this.#api.fetchFreeBalance();
        return this.balance;
    }
}

module.exports = BinanceApi;