const { getUID } = require("../util/bcrypt");
const { getNewTokenExpiry } = require("../util/helpers");
const response = require("../util/response");
const { validToken } = require("../util/validation");

const sessionsModel = require("../models/sessions");

const refreshToken = async (req, res) => {
    try {
        const loggedOut = false;
        const reqTime = new Date().getTime();

        const { rt_token, at_token } = req.headers;
        if (!validToken(rt_token) || !validToken(at_token)) {
            return response(res, 400, false, "Invalid Token", {});
        }
        const session = await sessionsModel.getSession({ authToken: at_token, loggedOut, refreshToken: rt_token });

        if (!session) {
            return response(res, 400, false, "Invalid Token", {});
        }

        const { refershTokenExpiryAt: _refershTokenExpiryAt, _id } = session;

        if (_refershTokenExpiryAt < reqTime) {
            await sessionsModel.updateSession({ _id }, { loggedOut: true });
            return response(res, 401, false, "Refresh Token Expired", {});
        }

        const refreshToken = getUID();
        const authToken = getUID();
        const authTokenExpiryAt = getNewTokenExpiry(reqTime);
        const refershTokenExpiryAt = getNewTokenExpiry(reqTime, 'RT');

        await sessionsModel.updateSession({ _id }, { refreshToken, authToken, authTokenExpiryAt, refershTokenExpiryAt });

        return response(res, 200, true, "Auth Token Generated", {
            rt_token: refreshToken, at_token: authToken, at_expiry: authTokenExpiryAt, rt_expiry: refershTokenExpiryAt
        });

    } catch (err) {
        return response(res, 500, false, "Something Went Wrong", err);
    }
};


module.exports = {
    refreshToken,
};
