// controllers/fameRankingsController.js
const db = require('../models/db'); // Import the database connection

// Get all game rankings by game ID
const getGameRankingsRoutesByGameID = (req, res) => {
    const { game_id } = req.query;
    
    const query = 'SELECT * FROM team_rankings WHERE game_id = ? ORDER BY total DESC';

    db.query(query, [game_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching data' });
      }
      
      return res.json(results);
    });
};

const getGameRankingsOverallByTournamentID = (req, res) => {
  const { tournament_id } = req.query;
  
  const query = 'SELECT tr.team_id, tr.team_name, SUM(tr.pts) AS total_places, SUM(tr.kill_num) AS total_kills, SUM(tr.total) AS total_pts FROM team_rankings tr WHERE tr.game_id IN (SELECT game_id FROM game_rounds WHERE tournament_id = ? AND is_ended = TRUE) GROUP BY tr.team_id, tr.team_name';


  db.query(query, [tournament_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    
    return res.json(results);
  });
};


module.exports = { getGameRankingsRoutesByGameID, getGameRankingsOverallByTournamentID };
