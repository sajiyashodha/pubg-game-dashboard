// routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const gameRankingsController = require('../controllers/gameRankingsController');

// Route to get all tournaments
router.get('/', gameRankingsController.getGameRankingsRoutesByGameID);
router.get('/overall', gameRankingsController.getGameRankingsOverallByTournamentID);

module.exports = router;
