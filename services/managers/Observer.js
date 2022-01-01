const fs = require('fs');
const CoinObservation = require('../../models/CoinObservation');

// const CoinGeckoApi = require('../CoinGeckoApi');
const BinanceApi = require('../BinanceApi');

class Observer {
    static addNewVal = (val) => {
        let is_route_changed = false;
        if (CoinObservation.current_observation.includes(val)) return false;

        const length = CoinObservation.current_observation.length;

        /**Grafik yönü değişimi olmuş olabilir kontrol edilmeli */
        if (length > 1) {

            if (CoinObservation.current_observation[length - 1] > CoinObservation.current_observation[length - 2] /**Hali hazırda ölçüm yönü yukarı ise */
                && CoinObservation.current_observation[length - 1] > val /**Yeni gelen veri son verinin altında ise ivme aşağıya dönmüş */) {

                if (CoinObservation.current_observation[length - 1] < val * 1.002 /**Yeni gelen veri eski veriden 25/10000 oranında aşağıda ise hiçbirşey değişmemiş demektir. Gözleme dahil edilmemeli */) return false;

                CoinObservation.reverseRoute(false);
                is_route_changed = true;
            }


            if (CoinObservation.current_observation[length - 1] < CoinObservation.current_observation[length - 2] /**Hali hazırda ölçüm yönü aşağı ise */
                && CoinObservation.current_observation[length - 1] < val /**Yeni gelen veri son verinin üzerinde ise ivme yukarıya dönmüş */) {

                if (CoinObservation.current_observation[length - 1] > val * 0.998 /**Yeni gelen veri eski veriden 25/10000 oranında yukarıda ise hiçbirşey değişmemiş demektir. Gözleme dahil edilmemeli */) return false;

                CoinObservation.reverseRoute(true);
                is_route_changed = true;
            }

        }

        if (!is_route_changed) CoinObservation.continueRoute();

        CoinObservation.current_observation.push(val);

        return true;
    }

    static doTransaction = async () => {
        const _binanceApi = new BinanceApi();
        const market_price = await _binanceApi.getCoinPrice(process.env.COIN);

        if (this.addNewVal(market_price)) {
            await _binanceApi.closeAllOpenOrders(process.env.COIN);

            let free_balance = await _binanceApi.getFreeBalance();

            if (CoinObservation.is_buy_transaction_valid && free_balance['USDT'] > 10) await _binanceApi.openBuyOrder(market_price, process.env.COIN, free_balance);
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