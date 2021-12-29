const ccxt = require('ccxt');
const CoinObservation = require('../models/CoinObservation');
const Transaction = require('../models/mongoose/Transaction');

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

    getFreeCoinBalance = async (coin) => {
        let balance = await this.#api.fetchFreeBalance();
        return balance[coin];
    }

    openBuyOrder = async (from, coin, balance) => {
        await this.#api.createMarketBuyOrder(`${coin}/USDT`, balance['USDT']/from);
        new Transaction({
            coin_name: process.env.COIN,
            coin_price: from,
            coin_amount:  balance['USDT']/from,
            usdt_price: balance['USDT'],
            is_sold: false
        }).save();

        CoinObservation.bought_price = from;
    }

    openSellOrder = async (from, coin, balance) => {
        await this.#api.createMarketSellOrder(`${coin}/USDT`, balance[coin]);
        new Transaction({
            coin_name: process.env.COIN,
            coin_price: from,
            coin_amount: balance[coin],
            usdt_price: balance[coin]/from,
            is_sold: true
        }).save();

        CoinObservation.bought_price = 0
    }

    closeAllOpenOrders = async (coin) => {
        let orders = await this.#api.fetchOpenOrders(`${coin}/USDT`);
        orders.forEach(async order => {
            await this.#api.cancelOrder(order.id, `${coin}/USDT`);
        })
    }
}

module.exports = BinanceApi;