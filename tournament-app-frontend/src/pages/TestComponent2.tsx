import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

// Define a Team interface
interface Team {
  rank: number;
  name: string;
  place: number;
  elim: number;
  total: number;
  logo: string;
}

// Sample data with type annotation
const teams: Team[] = [
  {
    rank: 1,
    name: "Team Alpha",
    place: 1,
    elim: 10,
    total: 100,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 2,
    name: "Team Bravo",
    place: 2,
    elim: 8,
    total: 90,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 3,
    name: "Team Charlie",
    place: 3,
    elim: 7,
    total: 85,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 4,
    name: "Team Delta",
    place: 4,
    elim: 6,
    total: 80,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 5,
    name: "Team Echo",
    place: 5,
    elim: 5,
    total: 75,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 6,
    name: "Team Foxtrot",
    place: 6,
    elim: 4,
    total: 70,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 7,
    name: "Team Golf",
    place: 7,
    elim: 3,
    total: 65,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 8,
    name: "Team Hotel",
    place: 8,
    elim: 2,
    total: 60,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 9,
    name: "Team India",
    place: 9,
    elim: 1,
    total: 55,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 10,
    name: "Team Juliet",
    place: 10,
    elim: 0,
    total: 50,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 11,
    name: "Team Kilo",
    place: 11,
    elim: 9,
    total: 45,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 12,
    name: "Team Lima",
    place: 12,
    elim: 8,
    total: 40,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 13,
    name: "Team Mike",
    place: 13,
    elim: 7,
    total: 35,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 14,
    name: "Team November",
    place: 14,
    elim: 6,
    total: 30,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
  {
    rank: 15,
    name: "Team Oscar",
    place: 15,
    elim: 5,
    total: 25,
    logo: "https://img.icons8.com/?size=100&id=30929&format=png&color=000000",
  },
];

// Keyframes for animations
const glow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const MainPanel = styled.div`
  height: 100vh;  // Ensure it fills the entire screen height
  background: radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;  // Ensure it stretches content and prevents any space from being cut off
  padding-top: 10vh;
  padding-bottom: 7vh;
  font-family: 'Orbitron', sans-serif;
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
    background-color: #48bd09;  // Neon Blue
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
  padding-left:8%;
`;
const TableHeader = styled.div`
  display: flex;
  
  margin-bottom: 0.5rem;


  & > div:nth-child(n + 2) {  // Select all children starting from the second one
      background-color: #485144fc;
  }
`;

const HeaderTeamColumn = styled.div<{ align: "left" | "center"; width?: string }>`
  text-align: ${(props) => props.align};
  width: ${(props) => (props.width ? props.width : "auto")};
  font-size: 0.8rem;  /* Reduced font size */
  font-weight: bold;
  padding: 0.5rem;  /* Reduced padding */
`;

const HeaderColumn = styled.div<{ align: "left" | "center"; width?: string }>`
  padding: 0.5rem 0rem;  /* Reduced padding */
  text-align: ${(props) => props.align};
  width: ${(props) => (props.width ? props.width : "auto")};
  font-size: 0.8rem;  /* Reduced font size */
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
    box-shadow: linear-gradient(to right, #48bd091a 0%, #48bd0930 50%, transparent 100%);
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
  display: grid
`;

const TeamNameColumn = styled.div`
  width: 65%;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #48bd091c 0%, #48bd0938 50%, transparent 100%);
  padding-left: 10px;  // Adjust padding to match your design
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
  display: grid
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

// Main Component with Pagination
const Dashboard2 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate the current teams to be displayed
  const indexOfLastTeam = currentPage * rowsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - rowsPerPage;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);

  // Handle page change
  const nextPage = () => {
    if (currentPage < Math.ceil(teams.length / rowsPerPage)) {
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
      <SubTitleBar>Heroes Tournament | Round 1</SubTitleBar>
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

          {currentTeams.map((team) => (
            <TableRow key={team.rank}>
              <RankColumn>
                {team.rank}
              </RankColumn>
              <TeamNameColumn>
                <img src={team.logo} alt={`${team.name} Logo`} />
                {team.name}
              </TeamNameColumn>
              <OtherColumns>{team.place}</OtherColumns>
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
              {currentPage} / {Math.ceil(teams.length / rowsPerPage)}
            </span>
      <PageButton
        className="next" 
        aria-label="Next"
        onClick={nextPage}
        disabled={currentPage === Math.ceil(teams.length / rowsPerPage)}
        style={{
          cursor: currentPage === Math.ceil(teams.length / rowsPerPage) ? "not-allowed" : "pointer", // Change cursor based on page
          opacity: currentPage === Math.ceil(teams.length / rowsPerPage) ? 0.5 : 1, // Adjust opacity when disabled
        }}
        >
        &#x2192; {/* Right arrow */}
      </PageButton>
    </PaginationContainer>
        </AllTeams>
      </Body>
    </MainPanel>
  );
};

export default Dashboard2;
