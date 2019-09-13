const express = require('express');
const router = express.Router();

const updateScores = require('./apiController/updateScores');
const leaderboard = require('./apiController/leaderboard');
const activeSession = require('./apiController/activeSession');
const gameOver = require('./apiController/gameOver');

router.get("/updatescores", updateScores);
router.get("/leaderboard", leaderboard);
router.get("/activeSession", activeSession);
router.get("/gameover", gameOver);

module.exports = router;