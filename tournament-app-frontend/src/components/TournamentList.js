import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tournaments')
      .then((res) => setTournaments(res.data))
      .catch((err) => console.error('Error fetching tournaments:', err));
  }, []);

  return (
    <div>
      <h2>Tournaments</h2>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.tournament_id}>
            {tournament.tournament_name} (Created: {tournament.created_at})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentList;
