const axios = require('axios');

class CoinGeckoApi {
    static getSimplePrice = async (from, to) => {
        const response = await axios.get(`${process.env.CG_URL}/simple/price?ids=${from}&vs_currencies=${to}`);
        return response.data[from][to];
    }
}

module.exports = CoinGeckoApi;