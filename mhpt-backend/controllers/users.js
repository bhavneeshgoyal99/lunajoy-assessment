const { getUID, processSecret, checkSecret } = require("../util/bcrypt");
const { getNewTokenExpiry } = require("../util/helpers");
const response = require("../util/response");
const { hasKeys, cherryPickKeys } = require("../util/validation");
const { jwtDecode } = require("jwt-decode");

const usersModel = require("../models/users");

const sessionsModel = require("../models/sessions");

const signIn = async (req, res) => {
    try {
        const reqTime = new Date().getTime();
        const requiredKeys = ["credential", "clientId", "select_by"];
        if (!hasKeys(req.body, requiredKeys))
            throw { error: "Bad Request", code: 400 };


        const processedRequest = cherryPickKeys(req.body, requiredKeys);

        const { given_name, family_name, picture, email_verified, email: emailId } = jwtDecode(processedRequest.credential);

        let user = await usersModel.getUser({ emailId });

        if (!user || !checkSecret(processedRequest.clientId, user.clientId)) {
            const userData = {
                firstName: given_name,
                lastName: family_name,
                profileImage: picture,
                emailId: emailId,
                emailVerified: email_verified,
                clientId: processSecret(processedRequest.clientId)
            };
            user = await usersModel.createUser(userData);
        }
        const refreshToken = getUID();
        const authToken = getUID();
        const authTokenExpiryAt = getNewTokenExpiry(reqTime);
        const refershTokenExpiryAt = getNewTokenExpiry(reqTime, 'RT');

        const { refreshToken: rt_token, authToken: at_token, authTokenExpiryAt: at_expiry, refershTokenExpiryAt: rt_expiry } = await sessionsModel.createSession(
            { userId: user._id, refreshToken, authToken, authTokenExpiryAt, refershTokenExpiryAt }
        );

        return response(res, 200, true, "Sign In Successfull", { rt_token, at_token, at_expiry, rt_expiry, ...user._doc });
    }
    catch (err) {
        console.log(err);
        return response(res, 500, false, "Something Went Wrong", err);
    }
};

module.exports = {
    signIn
};
