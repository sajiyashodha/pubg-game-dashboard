// controllers/gameStatisticsController.js
const db = require('../models/db'); // Import the database connection

// Get all tournaments
const getTotalMessagesNyGameID = (req, res) => {
    const { game_id } = req.query;

    const query = 'SELECT * FROM totalmessage WHERE game_id = ?';

    db.query(query, [game_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching data' });
      }
      console.log("TTTTTTTTTT", results);
      return res.json(results);
    });
};

module.exports = { getTotalMessagesNyGameID };
