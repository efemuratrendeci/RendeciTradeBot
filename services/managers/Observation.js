const CoinObservation = require('../../models/CoinObservation');
const CoinGeckoApi = require('../CoinGeckoApi');

class Observation {
    static addNewVal = (val) => {
        const is_new_value_added = true;
        if (CoinObservation.current_observation.includes(val)) return !is_new_value_added;

        const length = CoinObservation.current_observation.length;

        if (length > 1 && CoinObservation.current_observation[length - 1] > CoinObservation.current_observation[length - 2] && CoinObservation.current_observation[length - 1] > val) {
            let lastest = CoinObservation.current_observation[length - 1];
            CoinObservation.last_observation = CoinObservation.current_observation;
            CoinObservation.current_observation = [];
            CoinObservation.current_observation.push(lastest);
        }
        if (length > 1 && CoinObservation.current_observation[length - 1] < CoinObservation.current_observation[length - 2] && CoinObservation.current_observation[length - 1] < val) {
            let lastest = CoinObservation.current_observation[length - 1];
            CoinObservation.last_observation = CoinObservation.current_observation;
            CoinObservation.current_observation = [];
            CoinObservation.current_observation.push(lastest);
        }

        CoinObservation.current_observation.push(val);

        return is_new_value_added;
    }

    static isSellActionNeeded = async () => {
        const market_price = await CoinGeckoApi.getSimplePrice('avalanche-2', 'usd') / await CoinGeckoApi.getSimplePrice('tether', 'usd');
        if (this.addNewVal(market_price))
            console.log({ current_observation: CoinObservation.current_observation, last_observation: CoinObservation.last_observation });
    }
}

module.exports = Observation;