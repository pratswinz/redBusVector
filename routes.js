const express = require('express');
const router = express.Router();

const updateScores = require('./apiController/updateScores');
const leaderboard = require('./apiController/leaderboard');
const activeSession = require('./apiController/activeSession');
const userNameHandler = require('./apiController/userNameHandler');
const clearSession = require('./apiController/clearSession');

router.get("/updatescores", updateScores);
router.get("/leaderboard", leaderboard);
router.get("/activeSession", activeSession);
router.get("/uniqueid", userNameHandler);
router.get("/clearsession", clearSession);

module.exports = router;