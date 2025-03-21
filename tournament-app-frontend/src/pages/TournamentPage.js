import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [newTournamentName, setNewTournamentName] = useState('');

  // Fetch tournaments when the page loads
  useEffect(() => {
    fetchTournaments();
  }, []);

  // Function to fetch tournaments from the backend
  const fetchTournaments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tournaments');
      setTournaments(response.data); // Set the state with fetched tournaments
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  // Function to create a new tournament
  const handleCreateTournament = async (event) => {
    event.preventDefault();

    if (!newTournamentName) return;

    try {
      // Send a POST request to create a new tournament
      await axios.post('http://localhost:5000/api/tournaments', {
        tournament_name: newTournamentName,
      });

      // After creating a tournament, fetch the list again (auto-update)
      fetchTournaments();
      setNewTournamentName(''); // Clear the input field
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <div className="tournament-page">
      <h1>Tournament List</h1>

      {/* Create Tournament Form */}
      <form onSubmit={handleCreateTournament}>
        <input
          type="text"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
          placeholder="Enter new tournament name"
        />
        <button type="submit">Create Tournament</button>
      </form>

      {/* Tournament List in a Table */}
      <table>
        <thead>
          <tr>
            <th>Tournament ID</th>
            <th>Tournament Name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.tournament_id}>
              <td>{tournament.tournament_id}</td>
              <td>{tournament.tournament_name}</td>
              <td>{new Date(tournament.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentPage;
