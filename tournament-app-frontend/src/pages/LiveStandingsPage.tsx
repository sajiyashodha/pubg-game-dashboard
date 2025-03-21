import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

interface Ranking {
  team_id: number;
  team_name: string;
  kill_num: number;
  total_pts: number;
  total: number;
}

interface MatchStandingsPageProps {
  gameName: string | undefined;
  tournamentId: number | undefined;
  gameId: string | null;
  tournamentName: string | undefined;
}

interface GameRound {
  game_id: string;
  tournament_id: number;
  game_name: string;
  is_ended: boolean;
}

interface OverallRankings {
  team_id: number;
  team_name: string;
  total_places: number;
  total_kills: number;
  total_pts: number;
}


// Keyframes for animations
const glow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const MainPanel = styled.div`
  height: 100vh; // Ensure it fills the entire screen height
  background: radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; // Ensure it stretches content and prevents any space from being cut off
  padding-top: 10vh;
  padding-bottom: 7vh;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const TitleBar = styled.div`
  width: 100%;
  text-align: left;
  font-size: 6vh;
  position: relative;
  padding-left: 8%;
  margin-bottom: 0.5rem;
  height: 7vh;

  span.match {
    position: relative;
    display: inline-block;
    padding: 0.1rem 0.6rem;
    background-color: #48bd09; // Neon Blue
    z-index: 1;
    color: #fff;
    border-radius: 5px;
    text-shadow: 0 0 10px #48bd09, 0 0 20px #48bd09;
  }

  span.standings {
    margin-left: 0.5rem;
    color: #ffffff;
    text-shadow: 0 0 10px #48bd09, 0 0 20px #48bd09;
  }
`;

const SubTitleBar = styled.div`
  width: 100%;
  text-align: left;
  font-size: 4vh;
  margin-bottom: 0.5rem;
  padding-left: 8%;
  height: 7vh;
`;

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
`;

const AllTeams = styled.div`
  width: 40%;
  overflow-y: auto;
  font-weight: lighter;
  padding-left: 8%;
`;
const TableHeader = styled.div`
  display: flex;

  margin-bottom: 0.5rem;

  & > div:nth-child(n + 2) {
    // Select all children starting from the second one
    background-color: #485144fc;
  }
`;

const HeaderTeamColumn = styled.div<{
  align: "left" | "center";
  width?: string;
}>`
  text-align: ${(props) => props.align};
  width: ${(props) => (props.width ? props.width : "auto")};
  font-size: 0.8rem; /* Reduced font size */
  font-weight: bold;
  padding: 0.5rem; /* Reduced padding */
`;

const HeaderColumn = styled.div<{ align: "left" | "center"; width?: string }>`
  padding: 0.5rem 0rem; /* Reduced padding */
  text-align: ${(props) => props.align};
  width: ${(props) => (props.width ? props.width : "auto")};
  font-size: 0.8rem; /* Reduced font size */
  font-weight: bold;
`;

const TableRow = styled.div`
  display: flex;
  margin: 0.3rem 0;
  border-radius: 5px;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  height: 5vh;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: linear-gradient(
      to right,
      #48bd091a 0%,
      #48bd0930 50%,
      transparent 100%
    );
    animation: ${glow} 1.5s infinite alternate;
  }
`;

const RankColumn = styled.div`
  width: 15%;
  text-align: left;
  font-size: 1.4rem;
  background: transparent;
  font-weight: 600;
  align-items: center;
  display: grid;
`;

const TeamNameColumn = styled.div`
  width: 65%;
  display: flex;
  align-items: center;
  background: linear-gradient(
    to right,
    #48bd091c 0%,
    #48bd0938 50%,
    transparent 100%
  );
  padding-left: 10px; // Adjust padding to match your design
  font-size: 1.1rem;

  img {
    width: 30px;
    height: 30px;
    margin-right: 1rem;
  }
`;

const OtherColumns = styled.div`
  width: 20%; // Reduce the width to make it smaller
  text-align: center;
  font-size: 1.4rem; // Reduce the font size
  background: #485144fc; // Green background
  padding: 0.3rem 0.5rem; // Reduce padding for smaller boxes
  border-radius: 5px; // Rounded corners
  margin: 0 0.25rem; // Spacing between columns
  font-weight: 600;
  align-items: center;
  display: grid;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button`
  width: 40px; /* Adjust the size of the circle */
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddd; /* Light background for the buttons */
  border: none;
  cursor: pointer;
  font-size: 18px; /* Adjust size for the arrows */
  transition: background-color 0.3s;

  &:hover {
    background-color: #bbb; /* Slightly darker background on hover */
  }

  &:focus {
    outline: none; /* Remove the outline on focus */
  }

  &.prev {
    /* Add specific styles for the "prev" button */
    background-color: #485144fc;
  }

  &.next {
    /* Add specific styles for the "next" button */
    background-color: #485144fc;
  }
`;

const LiveStandingsPage: React.FC<MatchStandingsPageProps> = ({
  gameName,
  tournamentId,
  gameId,
  tournamentName,
}) => {
  const [rankings, setRankings] = useState([] as Ranking[]);
  const [teamPoints, setTeamPoints] = useState<Map<number, number>>(new Map());
  const [tournamentDataLoaded, setTournamentDataLoaded] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // State to track if the game has ended
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch overall points for the tournament (First Effect)
  useEffect(() => {
    console.log("tournamentId use Effect");
    const fetchOverallPts = async () => {
      if (!tournamentId) {
        setTournamentDataLoaded(true);
        return; // Avoid fetching if tournamentId is not available
      }

      try {
        const response = await axios.get<OverallRankings[]>(
          `http://localhost:5000/api/game-rankings/overall?tournament_id=${tournamentId}`
        );

        const pointsMap = new Map<number, number>();
        response.data.forEach((overallRanking) => {
          pointsMap.set(overallRanking.team_id, overallRanking.total_pts);
        });

        setTeamPoints(pointsMap); // Store points in state
        setTournamentDataLoaded(true); // Mark tournament data as loaded
        console.log("pointsMap", pointsMap);
        console.log("response.data", response.data);
      } catch (error) {
        console.error("Error fetching overall points:", error);
      }
    };

    fetchOverallPts();
  }, [tournamentId]);

  // Fetch match rankings for the game (Second Effect, depends on tournament data)
  useEffect(() => {
    console.log("gameId useEffect");

    if (!tournamentDataLoaded || !gameId || gameEnded) return; // Avoid running if the game is ended

    const fetchMatchRankings = async () => {
      try {
        const response1 = await axios.get<GameRound>(
          `http://localhost:5000/api/game_rounds/${gameId}`
        );
        console.log("response1.data", response1.data);

        // If the game round has ended, set gameEnded to true and refresh the page
        if (response1.data.is_ended) {
          setGameEnded(true); // Mark game as ended
          window.location.reload(); // Refresh the page
          return; // Stop further execution if the game has ended
        }

        const response2 = await axios.get<Ranking[]>(
          `http://localhost:5000/api/game-rankings?game_id=${gameId}`
        );

        // Process and update rankings based on teamPoints
        const updatedRankings = response2.data.map((ranking) => {
          const currentPts = teamPoints.get(ranking.team_id) || 0;
          const updatedTotal = Number(currentPts) + Number(ranking.kill_num); // Add kill_num to total_pts
          return { ...ranking, total: updatedTotal, total_pts: currentPts }; // Update the ranking with the new total
        });

        // Sort rankings by total (descending order)
        updatedRankings.sort((a, b) => Number(b.total) - Number(a.total));
        console.log("updatedRankings", updatedRankings);

        // Set the updated rankings
        setRankings(updatedRankings);
      } catch (error) {
        console.error("Error fetching match rankings:", error);
      }
    };

    fetchMatchRankings(); // Fetch match rankings after tournament data is loaded

    // Set interval to update rankings every 5 seconds (but won't run if game is ended)
    const intervalId = setInterval(() => {
      if (!gameEnded) {
        fetchMatchRankings(); // Re-fetch the rankings every 5 seconds if the game is not ended
      }
    }, 5000);

    // Clean up the interval on component unmount or when game ends
    return () => clearInterval(intervalId);
  }, [tournamentDataLoaded, gameId, teamPoints, gameEnded]); // Runs when tournamentDataLoaded, gameId, or teamPoints change

  // Calculate the current teams to be displayed
  const indexOfLastTeam = currentPage * rowsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - rowsPerPage;
  const currentTeams = rankings.slice(indexOfFirstTeam, indexOfLastTeam);

  // Handle page change
  const nextPage = () => {
    if (currentPage < Math.ceil(rankings.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <MainPanel>
      <TitleBar>
        <span className="match">LIVE</span>
        <span className="standings">STANDINGS</span>
      </TitleBar>
      <SubTitleBar>
        {tournamentName === null && gameName === null
          ? null
          : tournamentName && gameName
          ? `${tournamentName} | ${gameName}`
          : tournamentName
          ? tournamentName
          : gameName}
      </SubTitleBar>
      {currentTeams.length > 0 && (
        <Body>
          <AllTeams>
            <TableHeader>
              <HeaderColumn align="left" width="15%"></HeaderColumn>
              <HeaderTeamColumn align="left" width="65%">
                TEAM
              </HeaderTeamColumn>
              <HeaderColumn align="center" width="20%">
                PLACE
              </HeaderColumn>
            </TableHeader>

            {currentTeams.map((team, index) => (
              <TableRow key={indexOfFirstTeam + index + 1}>
                <RankColumn>{indexOfFirstTeam + index + 1}</RankColumn>
                <TeamNameColumn>
                  <img
                    src={`./team_logos/${tournamentId}/${team.team_id}.jpeg`}
                    alt={`${team.team_name} Logo`}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement; // Cast to HTMLImageElement
                      img.src = './team_logos/nologo.jpg'; // Set default image
                    }}
                  />
                  {team.team_name}
                </TeamNameColumn>
                <OtherColumns>
                  {tournamentId && teamPoints.size > 0
                    ? `${team.total_pts} + ${team.kill_num}`
                    : `${team.kill_num}`}
                </OtherColumns>
              </TableRow>
            ))}
            <PaginationContainer>
              <PageButton
                className="prev"
                aria-label="Previous"
                onClick={prevPage}
                disabled={currentPage === 1}
                style={{
                  cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor based on page
                  opacity: currentPage === 1 ? 0.5 : 1, // Adjust opacity when disabled
                }}
              >
                &#x2190; {/* Left arrow */}
              </PageButton>
              <span style={{ margin: "0 10px" }}>
                {currentPage} / {Math.ceil(rankings.length / rowsPerPage)}
              </span>
              <PageButton
                className="next"
                aria-label="Next"
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(rankings.length / rowsPerPage)
                }
                style={{
                  cursor:
                    currentPage === Math.ceil(rankings.length / rowsPerPage)
                      ? "not-allowed"
                      : "pointer", // Change cursor based on page
                  opacity:
                    currentPage === Math.ceil(rankings.length / rowsPerPage)
                      ? 0.5
                      : 1, // Adjust opacity when disabled
                }}
              >
                &#x2192; {/* Right arrow */}
              </PageButton>
            </PaginationContainer>
          </AllTeams>
        </Body>
      )}
    </MainPanel>
  );
};

export default LiveStandingsPage;
