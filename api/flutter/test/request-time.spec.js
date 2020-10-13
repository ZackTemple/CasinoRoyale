// Test for middleware/request-time.js
const assert = require('chai').assert;
const requestTime = require('../middleware/request-time.js');

// Suite
describe('requestTime middleware', function() {

    it('should add a `requestDate` property to the `req` parameter', function() {
        const req = {};
        requestTime(req, null, () => {});
        assert.exists(req.requestDate);
    });

    it('should add a `requestTime` property to the `req` parameter', function() {
        const req = {};
        requestTime(req, null, () => {});
        assert.exists(req.requestTime);
    });
});