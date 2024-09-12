const { authTokenExpiryLimitInHours, refreshTokenExpiryLimitInHours } = require('../config/variables');

const getNewTokenExpiry = (reqTime, refreshToken = null) => {
    return reqTime + (
        (refreshToken ? refreshTokenExpiryLimitInHours : authTokenExpiryLimitInHours)
        * 60 * 60 * 1000);
};

module.exports = {
    getNewTokenExpiry
};