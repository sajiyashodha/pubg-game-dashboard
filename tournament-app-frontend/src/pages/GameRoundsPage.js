import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../GameRoundsPage.css';

const GameRoundsPage = () => {
  const [gameRounds, setGameRounds] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [editableGameId, setEditableGameId] = useState(null);
  const [updatedGameName, setUpdatedGameName] = useState('');
  const [updatedTournamentId, setUpdatedTournamentId] = useState(null);

  useEffect(() => {
    fetchTournaments();
    fetchGameRounds();
  }, []);

  const handleDeleteClick = async (gameId) => {
    try {
      // Prompt user to confirm delete action
      const confirmDelete = window.confirm('Are you sure you want to delete this game round? It can not be reversed once you do it');
      if (!confirmDelete) return;
  
      // Call API to delete the game round and its associated data
      await axios.delete(`http://localhost:5000/api/game_rounds/${gameId}`);
      
      // Fetch updated game rounds list after deletion
      fetchGameRounds();
    } catch (error) {
      console.error('Error deleting game round:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tournaments');
      // Ensure tournament_id is a number
      const tournamentsWithNumberIds = response.data.map(tournament => ({
        ...tournament,
        tournament_id: Number(tournament.tournament_id),
      }));
      setTournaments(tournamentsWithNumberIds);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const fetchGameRounds = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/game_rounds');
      setGameRounds(response.data);
    } catch (error) {
      console.error('Error fetching game rounds:', error);
    }
  };

  const handleEditClick = (gameId, gameName, tournamentId) => {
    setEditableGameId(gameId);
    setUpdatedGameName(gameName);
    setUpdatedTournamentId(tournamentId !== null ? Number(tournamentId) : null);  // Convert to number when editing, handle null
  };

  const handleSaveChanges = async (gameId) => {
    try {
      // Ensure updatedTournamentId is a number when saving
      const tournamentIdAsNumber = Number(updatedTournamentId);

      if (isNaN(tournamentIdAsNumber)) {
        throw new Error('Invalid Tournament ID');
      }

      await axios.put(`http://localhost:5000/api/game_rounds/${gameId}`, {
        game_name: updatedGameName,
        tournament_id: updatedTournamentId !== null ? tournamentIdAsNumber : null,  // Send null if no tournament selected
      });

      fetchGameRounds();
      setEditableGameId(null);
      setUpdatedGameName('');
      setUpdatedTournamentId(null);  // Reset to null after saving
    } catch (error) {
      console.error('Error saving game round changes:', error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedTournamentId = e.target.value === "" ? null : Number(e.target.value); // Handle null selection
    setUpdatedTournamentId(selectedTournamentId);
  };

  const handleViewStandings = (gameId) => {
    const matchRankingsUrl = `/match-rankings?gameId=${gameId}`;
    window.location.href = matchRankingsUrl;  // Navigate to match standings
  };

  return (
    <div className="game-rounds-page">
      <h1>Game Rounds</h1>
      <table>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Tournament ID</th>
            <th>Game Name</th>
            <th>Started At</th>
            <th>Ongoing</th>
            <th>View Standings</th> {/* New column header for standings */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gameRounds.map((gameRound) => (
            <tr key={gameRound.game_id}>
              <td>
                <span>{gameRound.game_id}</span> {/* Displaying Game ID as text */}
              </td>
              <td>
                {editableGameId === gameRound.game_id ? (
                  <select
                    value={updatedTournamentId || ""}  // Ensure value is "" if null, allowing unselection
                    onChange={handleSelectChange}
                  >
                    {tournaments.length > 0 && (
                      <option value="">Select Tournament</option>  // Allow "unselect" option if more than 1 tournament
                    )}
                    {tournaments.map((tournament) => (
                      <option key={tournament.tournament_id} value={tournament.tournament_id}>
                        {tournament.tournament_name} (ID: {tournament.tournament_id})
                      </option>
                    ))}
                  </select>
                ) : (
                  gameRound.tournament_id
                )}
              </td>
              <td>
                {editableGameId === gameRound.game_id ? (
                  <input
                    type="text"
                    value={updatedGameName}
                    onChange={(e) => setUpdatedGameName(e.target.value)}
                  />
                ) : (
                  gameRound.game_name
                )}
              </td>
              <td>{new Date(gameRound.started_at).toLocaleString()}</td>
              <td>
                <span className={`status-icon ${gameRound.is_ended === 1 ? 'ended' : 'not-ended'}`}></span>
                {gameRound.is_ended === 1 ? 'Ended' : 'Ongoing'}
              </td>
              <td>
                {/* View Standings Column */}
                <button
                  className="view-standings-icon"
                  title="View Standings"
                  onClick={() => handleViewStandings(gameRound.game_id)}
                >
                  <span role="img" aria-label="view standings">📊</span> {/* Example Icon */}
                </button>
              </td>
              <td>
                {editableGameId === gameRound.game_id ? (
                  <button onClick={() => handleSaveChanges(gameRound.game_id)}>Save</button>
                ) : (
                  <><button onClick={() => handleEditClick(gameRound.game_id, gameRound.game_name, gameRound.tournament_id)}>
                      Edit
                    </button><button onClick={() => handleDeleteClick(gameRound.game_id)} style={{ marginLeft: '10px' }}>Delete</button></>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameRoundsPage;
