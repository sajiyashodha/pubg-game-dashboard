import React, { useState } from 'react';
import axios from 'axios';

const CreateTournament = ({ onTournamentCreated }) => {
  const [tournamentName, setTournamentName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/tournaments', { tournament_name: tournamentName })
      .then((res) => {
        onTournamentCreated(res.data);
        setTournamentName('');
      })
      .catch((err) => console.error('Error creating tournament:', err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
        placeholder="Tournament Name"
      />
      <button type="submit">Create Tournament</button>
    </form>
  );
};

export default CreateTournament;
