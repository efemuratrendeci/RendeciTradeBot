class CoinObservation {
    static current_observation = [];
    static last_observation = [];
    static observation_route = '';
    static bought_price = 0;

    static get is_buy_transaction_valid() {
        return this.current_observation.length > 1 
            && this.last_observation.length > 0 
            && this.observation_route.slice(Math.max(this.observation_route.length - 3, 0)) === '--+'
            && this.last_observation[this.last_observation.length - 3] > this.current_observation[this.current_observation.length - 1] ? true : false
    }

    static get is_sell_transaction_valid() {
        return this.observation_route.slice(Math.max(this.observation_route.length - 2, 0)) === '+-' 
            && this.current_observation.length > 1 
            && this.last_observation.length > 0 
            && this.current_observation[this.current_observation.length - 1] >= this.bought_price * 1.0035 ? true : false
    }

    static get is_price_lower_then_limit() {
        return this.observation_route 
            && this.observation_route[this.observation_route.length - 1] === '-' 
            && this.bought_price > this.current_observation[this.current_observation.length - 1] 
            && this.current_observation[this.current_observation.length - 1] / this.bought_price < 0.99 ? true : false;
    }

    static get is_price_over_one_percent() {
        return this.bought_price >= this.current_observation[this.current_observation.length - 1] * 1.01;
    }

    static reverseRoute = (up) => {
        const length = this.current_observation.length;

        let lastest = this.current_observation[length - 1];
        this.last_observation = this.current_observation;
        this.current_observation = [];
        this.current_observation.push(lastest);

        if(this.observation_route.length > 30) this.observation_route = this.observation_route.slice(Math.max(this.observation_route.length - 2, 0));

        this.observation_route += up ? '+' : '-'
    }

    static continueRoute = () => {
        if(!this.observation_route) return;
        if(this.observation_route.length > 30) this.observation_route = this.observation_route.slice(Math.max(this.observation_route.length - 2, 0));

        this.observation_route += this.observation_route[this.observation_route.length - 1];
    }

}

module.exports = CoinObservation;