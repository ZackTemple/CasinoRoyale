// Add date and time to the request
// Dependencies: moment
const moment = require('moment');

module.exports = (req, res, next) => {
    let [date, time] =  moment().format().split("T");
    req.requestDate = date;
    req.requestTime = time;
    next();
};