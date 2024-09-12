const express = require("express");
const router = express.Router();

const users = require("../controllers/users");
const athenticate = require("../middlewares/authenticate");
const sessions = require("../controllers/sessions");
const logs = require("../controllers/logs");

router.post("/signIn/", users.signIn);

router.get("/refresh-token/", sessions.refreshToken);

router.get("/logs/", athenticate, logs.getLogs);

router.post("/logs/", athenticate, logs.saveLogs);
router.get("/analytics/", athenticate, logs.getAnalytics);

module.exports = router;
