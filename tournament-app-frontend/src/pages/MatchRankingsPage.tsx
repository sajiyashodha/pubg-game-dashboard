import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../MatchRankingsPage.css';
import MatchStandingsPage from './MatchStandingsPage';
import LiveStandingsPage from './LiveStandingsPage';

interface GameRound {
  game_id: string;
  tournament_id: number;
  game_name: string;
  is_ended: boolean;
}

interface Tournament {
  tournament_id: number;
  tournament_name: string;
}

const MatchRankingsPage = () => {
  const [gameRoundName, setGameRoundName] = useState<string|undefined>(undefined);
  const [tournamentName, setTournamentName] = useState<string|undefined>(undefined);
  const [tournamentId, setTournamentId] = useState<number|undefined>(undefined);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('gameId');

  useEffect(() => {
    const fetchGameRound = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<GameRound>(`http://localhost:5000/api/game_rounds/${gameId}`);
        const gameRound: GameRound = response.data;

        if (!gameRound.tournament_id) {
          setIsLoading(false);
          setIsError(true);
          return;
        }

        setIsLoading(false);
        setGameRoundName(gameRound.game_name);
        setIsEnded(gameRound.is_ended);
        setTournamentId(gameRound.tournament_id);

        if (gameRound.tournament_id) {
          const response2 = await axios.get<Tournament>(`http://localhost:5000/api/tournaments/${gameRound.tournament_id}`);
          setTournamentName(response2.data.tournament_name);
        }

      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        console.error('Error fetching match rankings:', error);
      }
    };

    if (gameId) {
      fetchGameRound();
    } else {
      setIsLoading(false);
      setIsError(true);
    }
  }, [gameId]);

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <h1>Loading...</h1>
        </div>
      ) : isError ? (
        <h1>And Error is occurred. Please make sure that the GameID is valid and tourenament is set properly for the game round</h1>
      ) : isEnded ? (
        <MatchStandingsPage gameName={gameRoundName} tournamentId={tournamentId} gameId={gameId} tournamentName={tournamentName}/>
      ) : (
        <LiveStandingsPage gameName={gameRoundName} tournamentId={tournamentId} gameId={gameId} tournamentName={tournamentName}/>
      )}
    </>
  );
};

export default MatchRankingsPage;
