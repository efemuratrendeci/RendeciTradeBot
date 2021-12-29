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

    getCoinPrice = async (coin) => {
        let response = await this.#api.fetchTicker(`${coin}/USDT`);
        return response.bid;
    }
}

module.exports = BinanceApi;