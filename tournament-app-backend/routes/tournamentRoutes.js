// routes/tournamentRoutes.js
const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

// Route to get all tournaments
router.get('/', tournamentController.getTournaments);

router.get('/:tournament_id', tournamentController.getTournamentByTournamentID);

// Route to create a new tournament
router.post('/', tournamentController.createTournament);

module.exports = router;
