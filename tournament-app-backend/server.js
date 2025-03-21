// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const tournamentRoutes = require('./routes/tournamentRoutes');
const gameRoundRoutes = require('./routes/gameRoundRoutes');
const gameStatisticsRoutes = require('./routes/gameStatisticsRoutes');
const gameRankingsRoutes = require('./routes/gameRankingsRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/game_rounds', gameRoundRoutes);
app.use('/api/totalmessage', gameStatisticsRoutes);
app.use('/api/game-rankings', gameRankingsRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
