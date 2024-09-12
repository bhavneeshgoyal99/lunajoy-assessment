const sessionsModel = require("../models/sessions");
const usersModel = require("../models/users");

const response = require("../util/response");

const { validToken } = require("../util/validation");

module.exports = async (req, res, next) => {
    try {
        const loggedOut = false;

        const { at_token: authToken } = req.headers;
        if (!validToken(authToken)) {
            return response(res, 400, true, "Invalid Token", {});
        }
        const session = await sessionsModel.getSession({ authToken, loggedOut });

        if (!session || !(session.authTokenExpiryAt >= new Date().getTime())) {
            return response(res, 400, false, "Invalid Token", {});
        }

        const user = await usersModel.getUser({ _id: session.userId });

        const { deleted } = user;

        if (deleted) {
            return response(res, 401, false, "Unauthorised", {});
        }

        req.user = user._doc;

        next();

    } catch (err) {
        return response(res, 500, false, "Something Went Wrong", err);
    }
};
