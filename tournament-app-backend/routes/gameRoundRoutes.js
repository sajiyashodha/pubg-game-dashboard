// routes/gameRoundRoutes.js
const express = require('express');
const router = express.Router();
const gameRoundController = require('../controllers/gameRoundController');

// Route to get all game rounds for a tournament
router.get('/', gameRoundController.getGameRounds);

router.get('/:game_id', gameRoundController.getGameRoundByGameID);


// // Route to create a new game round
// router.post('/', gameRoundController.createGameRound);

// Route to update a game round
router.put('/:game_id', gameRoundController.updateGameRound);

// Route to update a game round
router.delete('/:game_id', gameRoundController.deleteGameRound);


module.exports = router;
