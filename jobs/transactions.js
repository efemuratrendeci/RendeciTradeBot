const cron = require('node-cron');
const Observation = require('../services/managers/Observation');

const task = () => {
    cron.schedule('* * * * *', async () => {
        Observation.isSellActionNeeded();

    });
}

module.exports = {
    do: task
};