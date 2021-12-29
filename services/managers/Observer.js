const CoinObservation = require('../../models/CoinObservation');
// const CoinGeckoApi = require('../CoinGeckoApi');
const BinanceApi = require('../BinanceApi');

class Observer {
    static addNewVal = (val) => {
        const is_new_value_added = true;
        let is_route_changed = false;
        if (CoinObservation.current_observation.includes(val)) return !is_new_value_added;

        const length = CoinObservation.current_observation.length;

        if (length > 1 && CoinObservation.current_observation[length - 1] > CoinObservation.current_observation[length - 2] && CoinObservation.current_observation[length - 1] > val) {
            CoinObservation.reverseRoute(false);
            is_route_changed = true;
        }
        if (length > 1 && CoinObservation.current_observation[length - 1] < CoinObservation.current_observation[length - 2] && CoinObservation.current_observation[length - 1] < val) {
            CoinObservation.reverseRoute(true);
            is_route_changed = true;
        }

        if (!is_route_changed) CoinObservation.continueRoute();
        CoinObservation.current_observation.push(val);

        return is_new_value_added;
    }

    static doTransaction = async () => {
        const _binanceApi = new BinanceApi();
        const market_price = await _binanceApi.getCoinPrice('AVAX');
        let result;
        if (this.addNewVal(market_price)) {
            result = { current_observation: CoinObservation.current_observation, last_observation: CoinObservation.last_observation, for: CoinObservation.observation_route };
            console.log({ current_observation: CoinObservation.current_observation, last_observation: CoinObservation.last_observation, for: CoinObservation.observation_route });


            if (CoinObservation.is_buy_transaction_valid && Balance.usd) Balance.buy(market_price);
            if (CoinObservation.is_sell_transaction_valid && Balance.coin) Balance.sell(market_price);
            if (CoinObservation.is_price_lower_then_limit && Balance.coin) Balance.sell(market_price);

            console.log(`usd: ${Balance.usd}`);
            console.log(`coin: ${Balance.coin}`);
        }


    }
}

class Balance {
    static usd = 100;
    static coin = 0;
    static buy = (from) => {
        CoinObservation.bought_price = from;
        Balance.coin = Balance.usd / from;
        Balance.usd = 0;
    }
    static sell = (from) => {
        CoinObservation.bought_price = 0;
        Balance.usd = Balance.coin * from;
        Balance.coin = 0;
    }
}

module.exports = Observer;