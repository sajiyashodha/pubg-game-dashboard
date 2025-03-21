import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TournamentsPage from './pages/TournamentPage';
import GameRoundsPage from './pages/GameRoundsPage';
import GameStatisticsPage from './pages/GameStatisticsPage';
import MatchRankingsPage from './pages/MatchRankingsPage';
import Dashboard from './pages/TestComponent';
import Dashboard2 from './pages/TestComponent2';
function App() {
  return (
    <Router>
      <div>


        {/* Define Routes for the Pages */}
        <Routes>
          <Route path="/" element={<TournamentsPage />} />
          <Route path="/game-rounds" element={<GameRoundsPage />} />
          <Route path="/game-statistics" element={<GameStatisticsPage />} />
          <Route path="/match-rankings" element={<MatchRankingsPage />} />
          <Route path="/test" element={<Dashboard />} />
          <Route path="/test2" element={<Dashboard2 />} />
        </Routes>
                {/* Navigation Bar */}
                <nav>
          <ul>
            <li>
              <Link to="/">Tournaments</Link>
            </li>
            <li>
              <Link to="/game-rounds">Game Rounds</Link>
            </li>
            {/* <li>
              <Link to="/game-statistics">Game Statistics</Link>
            </li> */}
            
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
