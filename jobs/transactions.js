const cron = require('node-cron');
const Observer = require('../services/managers/Observer');

const task = () => {
    cron.schedule('*/2 * * * * *', async () => {
        await Observer.doTransaction();
    });
}

module.exports = {
    do: task
};