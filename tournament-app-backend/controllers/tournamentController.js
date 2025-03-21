// controllers/tournamentController.js
const db = require('../models/db'); // Import the database connection

// Get all tournaments
const getTournaments = (req, res) => {
  db.query('SELECT * FROM tournaments ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
};

const getTournamentByTournamentID = (req, res) => {
  const { tournament_id } = req.params;
  
  const query = 'SELECT * FROM tournaments WHERE tournament_id = ? LIMIT 1';
  
  db.query(query, [tournament_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results[0]);
  });
  };

// Create a new tournament
const createTournament = (req, res) => {
  const { tournament_name } = req.body;
  const query = 'INSERT INTO tournaments (tournament_name, created_at) VALUES (?, NOW())';

  db.query(query, [tournament_name], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(201).json({ tournament_id: results.insertId, tournament_name });
  });
};

module.exports = { getTournaments, getTournamentByTournamentID, createTournament };
