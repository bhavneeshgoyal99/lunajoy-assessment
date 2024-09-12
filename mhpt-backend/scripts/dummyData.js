
const mongoDB = require("../config/mongoose");
const mongoose = require("mongoose");

const { processSecret } = require("../util/bcrypt");

const usersModel = require("../models/users");
const logsModel = require("../models/logs");

mongoose.connect(mongoDB.URL, mongoDB.options);

const addDummyData = async () => {
    try {
        console.log("Dummy Data Script started");

        const dummySetupUser = {
            "emailId": "bhavneesh.goyal99@gmail.com",
            "firstName": "Bhavneesh",
            "lastName": "Goyal",
            "emailVerified": true,
            "clientId": "117580371774-eoitdr8k2vchlecicv1d7qs033gqlqgo.apps.googleusercontent.com"
        };

        dummySetupUser.clientId = processSecret(dummySetupUser.clientId);

        let user = {};
        user = await usersModel.getUser({ emailId: dummySetupUser.emailId });

        if (!user) {
            user = await usersModel.createUser(user);
        }

        const createLogsPromises = [];

        for (let i = 0; i < 100; i++) {

            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - 102 + i);

            const log = {
                userId: user._id,
                moodRatings: Math.floor(Math.random() * 6),
                anxietyLevel: Math.floor(Math.random() * 6),
                sleepPatterns: Math.floor(Math.random() * 6),
                physicalActivity: Math.floor(Math.random() * 6),
                socialInteractions: Math.floor(Math.random() * 6),
                stressLevels: Math.floor(Math.random() * 6),
                symptomsDepressionAnxiety: Math.floor(Math.random() * 6),
                createdAt: createdAt.toISOString()
            }

            createLogsPromises.push(logsModel.createLog(log));
        }

        await Promise.all(createLogsPromises);

        console.log("Dummy Data Script ended");

    } catch (err) {
        console.log("error in dummy data", err);
    }

};

addDummyData();