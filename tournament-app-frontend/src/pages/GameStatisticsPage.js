// GameStatisticsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';  // You can also use BarChart or other charts from chart.js
import 'chart.js/auto';
import { useLocation } from 'react-router-dom';
import '../GameStatisticsPage.css'; // Add custom CSS for styling

const GameStatisticsPage = () => {
  const [totalMessages, setTotalMessages] = useState([]);
  const location = useLocation();

    // Get the query parameter (gameId) from the URL
    const queryParams = new URLSearchParams(location.search);
    const gameId = queryParams.get('gameId'); // this will get the gameId from the URL

  useEffect(() => {
    const fetchTotalMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/totalmessage?game_id=${gameId}`);
        setTotalMessages(response.data);
      } catch (error) {
        console.error('Error fetching total messages:', error);
      }
    };

    if (gameId) {
      fetchTotalMessages();
    }

    // Set interval to update data every 2 seconds
    const intervalId = setInterval(fetchTotalMessages, 2000);

    // // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [gameId]); // Re-run if gameId changes


  return (
    <div className="game-statistics-page">
      <h1>Game Statistics</h1>
      
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Team ID</th>
              <th>Health</th>
              <th>Kills</th>
              <th>Damage</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {totalMessages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.player_name}</td>
                <td>{msg.team_id}</td>
                <td>{msg.health}</td>
                <td>{msg.kill_num}</td>
                <td>{msg.damage}</td>
                <td>{msg.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameStatisticsPage;
