class CoinObservation {
    static current_observation = [];
    static last_observation = [];
    static get is_transaction_valid() {
        return CoinMeasure.amount.length > 1 ? true : false
    }
}

module.exports = CoinObservation;