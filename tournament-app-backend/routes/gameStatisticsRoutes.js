// routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const gameStatisticsController = require('../controllers/gameStatisticsController');

// Route to get all tournaments
router.get('/', gameStatisticsController.getTotalMessagesNyGameID);

module.exports = router;
