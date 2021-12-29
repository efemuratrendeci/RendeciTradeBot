const cron = require('node-cron');
const Observer = require('../services/managers/Observer');

const task = () => {
    cron.schedule('*/5 * * * * *', async () => {
        Observer.doTransaction();
    });
}

module.exports = {
    do: task
};