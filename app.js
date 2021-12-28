require('dotenv').config();
const transactions = require('./jobs/transactions');

transactions.do();
// const CoinGeckoApi = require('./services/CoinGeckoApi');
// const BinanceApi = require('./services/BinanceApi');



// const work = async () => {
//     const _binanceApi = new BinanceApi();
//     const _freeBalance = await _binanceApi.getFreeBalance();

//     const market_price = await CoinGeckoApi.getSimplePrice('bitcoin', 'usd') / await CoinGeckoApi.getSimplePrice('tether', 'usd');

//     console.log(market_price)
//     console.log(await _binanceApi.getFreeBalance());
// }

// work();



