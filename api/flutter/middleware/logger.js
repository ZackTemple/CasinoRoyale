// Dependencies: moment
const moment = require('moment');

const logger = (req, res, next) => {
    console.log('_____________________________________');
    console.log(`Route: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    let [date, time] =  moment().format().split("T");
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    next();
}

module.exports = logger;
