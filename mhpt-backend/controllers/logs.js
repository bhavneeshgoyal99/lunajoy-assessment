const response = require("../util/response");
const { hasKeys, cherryPickKeys } = require("../util/validation");

const logsModel = require("../models/logs");
const usersModel = require("../models/users");

const saveLogs = async (req, res) => {
    try {
        const requiredKeys = [
            "moodRatings",
            "anxietyLevel",
            "sleepPatterns",
            "physicalActivity",
            "socialInteractions",
            "stressLevels",
            "symptomsDepressionAnxiety"
        ];

        if (!hasKeys(req.body, requiredKeys))
            return response(res, 400, false, "Bad Request", {});

        const processedRequest = cherryPickKeys(req.body, requiredKeys);

        processedRequest.userId = req.user._id;

        const createdLog = await logsModel.createLog(processedRequest);

        // await usersModel.updateUser({ _id: `${req.user._id}` }, { submittedToday: true });

        req.io.emit('logCreated', createdLog._doc);

        return response(res, 200, true, "Saved Successfull", createdLog._doc);
    }
    catch (err) {
        console.log("Error in sign up", err);
        return response(res, 500, false, "Something Went Wrong", err);
    }
};

const getLogs = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate)
            return response(res, 400, false, "Bad Request", {});

        const fetchedLogs = await logsModel.fetchUserLogs(
            req.user._id.toString(),
            fromDate,
            toDate,
        );

        return response(res, 200, true, "Logs Fetch Successfull", fetchedLogs);
    }
    catch (err) {
        console.log(err);
        return response(res, 500, false, "Something Went Wrong", err);
    }
};

const getAnalytics = async (req, res) => {
    try {

        const fetchedLogs = await logsModel.getAnalytics(req.user._id.toString());

        return response(res, 200, true, "Logs Fetch Successfull", fetchedLogs);
    }
    catch (err) {
        console.log(err);
        return response(res, 500, false, "Something Went Wrong", err);
    }
}

module.exports = {
    saveLogs,
    getLogs,
    getAnalytics
};
