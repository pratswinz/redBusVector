const express = require('express');
const router = express.Router();

const updateScores = require('./apiController/updateScores');
const leaderboard = require('./apiController/leaderboard');
const activeSession = require('./apiController/activeSession');

router.get("/updatescores", updateScores);
router.get("/leaderboard", leaderboard);
router.get("/activeSession", activeSession);

module.exports = router;