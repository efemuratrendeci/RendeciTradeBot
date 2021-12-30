const cron = require('node-cron');
const Observer = require('../services/managers/Observer');

const task = () => {
    cron.schedule('* * * * * *', async () => {
        await Observer.doTransaction();
    });
}

module.exports = {
    do: task
};