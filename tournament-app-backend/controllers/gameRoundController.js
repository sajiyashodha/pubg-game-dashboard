// controllers/gameRoundController.js
const db = require('../models/db'); // Import the database connection

// Get all game rounds for a given tournament
const getGameRounds = (req, res) => {
//   const { tournament_id } = req.params;
//   const query = 'SELECT * FROM game_rounds WHERE tournament_id = ? ORDER BY started_at DESC';

//   db.query(query, [tournament_id], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     return res.json(results);
//   });

const query = 'SELECT * FROM game_rounds';

db.query(query, (err, results) => {
  if (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
  return res.json(results);
});
};

const getGameRoundByGameID = (req, res) => {
  const { game_id } = req.params;
  
  const query = 'SELECT * FROM game_rounds WHERE game_id = ? LIMIT 1';
  
  db.query(query, [game_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results[0]);
  });
  };

// // Create a new game round
// const createGameRound = (req, res) => {
//   const { tournament_id, game_name } = req.body;
//   const query = 'INSERT INTO game_rounds (tournament_id, game_name, started_at) VALUES (?, ?, NOW())';

//   db.query(query, [tournament_id, game_name], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     return res.status(201).json({ game_id: results.insertId, tournament_id, game_name });
//   });
// };

// Update a game round
const updateGameRound = (req, res) => {
  const { game_id } = req.params;
  const { game_name, tournament_id } = req.body;

    console.log(game_id, game_name, tournament_id)
  const query = 'UPDATE game_rounds SET game_name = ?, tournament_id = ? WHERE game_id = ?';
  db.query(query, [game_name, tournament_id, game_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.json({ message: 'Game round updated' });
  });
};

// Delete a game round
const deleteGameRound = (req, res) => {
  const { game_id } = req.params;

  // Start a transaction
  const connection = db.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to connect to database' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error(err);
        return res.status(500).json({ error: 'Failed to start transaction' });
      }

      // Delete from totalmessage table
      connection.query('DELETE FROM totalmessage WHERE game_id = ?', [game_id], (err) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete from totalmessage' });
          });
        }

        // Delete from team_rankings table
        connection.query('DELETE FROM team_rankings WHERE game_id = ?', [game_id], (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error(err);
              return res.status(500).json({ error: 'Failed to delete from team_rankings' });
            });
          }

          // Delete from game_rounds table
          connection.query('DELETE FROM game_rounds WHERE game_id = ?', [game_id], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete from game_rounds' });
              });
            }

            // Commit the transaction if everything is fine
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error(err);
                  return res.status(500).json({ error: 'Failed to commit transaction' });
                });
              }

              connection.release();  // Release the connection
              return res.status(200).json({ message: 'Game round deleted successfully' });
            });
          });
        });
      });
    });
  });
};

// module.exports = { getGameRounds, createGameRound, updateGameRound };

module.exports = { getGameRounds, getGameRoundByGameID, updateGameRound, deleteGameRound };
