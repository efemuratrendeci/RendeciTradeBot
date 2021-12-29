const fs = require('fs');
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
        const market_price = await _binanceApi.getCoinPrice(process.env.COIN);

        if (this.addNewVal(market_price)) {
            await _binanceApi.closeAllOpenOrders(process.env.COIN);

            let free_balance = await _binanceApi.getFreeBalance();

            if (CoinObservation.is_buy_transaction_valid && free_balance['USDT'] > 10 ) await _binanceApi.openBuyOrder(market_price, process.env.COIN, free_balance);
            if (CoinObservation.is_sell_transaction_valid && free_balance[process.env.COIN] >= 0.1) await _binanceApi.openSellOrder(market_price, process.env.COIN, free_balance);
            if (CoinObservation.is_price_lower_then_limit && free_balance[process.env.COIN] >= 0.1) await _binanceApi.openSellOrder(market_price, process.env.COIN, free_balance);
            if (CoinObservation.is_price_over_one_percent) await _binanceApi.openSellOrder(market_price, process.env.COIN, free_balance);


            console.log({
                    observation: { current_observation: CoinObservation.current_observation, last_observation: CoinObservation.last_observation, for: CoinObservation.observation_route },
                });

            // let text = fs.readFileSync(`${process.cwd()}/observer.json`);
            // if(!text) text = '[]';

            // let data = JSON.parse(text);

            // data.push({
            //     observation: { current_observation: CoinObservation.current_observation, last_observation: CoinObservation.last_observation, for: CoinObservation.observation_route },
                        //     money: Balance.usd,
            //     coin: Balance.coin,
            //     money_unreal: Balance.coin ? Balance.coin * market_price : Balance.usd
            // });

            // fs.writeFileSync(`${process.cwd()}/observer.json`, JSON.stringify(data));
        }


    }
}

class Balance {
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