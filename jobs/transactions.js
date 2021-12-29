const cron = require('node-cron');
const Observer = require('../services/managers/Observer');

const task = () => {
    cron.schedule('*/10 * * * * *', async () => {
        Observer.doTransaction();
    });
}

module.exports = {
    do: task
};