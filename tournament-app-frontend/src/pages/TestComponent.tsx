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
  padding-top: 14vh;
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
    background-color: #bd0913;  // Neon Blue
    z-index: 1;
    color: #fff;
    border-radius: 5px;
    text-shadow: 0 0 10px rgba(4, 151, 224, 0.8), 0 0 20px rgba(13, 23, 209, 0.6);
  }

  span.standings {
    margin-left: 0.5rem;
    color: #ffffff;
    text-shadow: 0 0 10px #bd0913, 0 0 20px #bd0913;
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

const WinnerTeam = styled.div`
  width: 40%;
  display: flex;
  // flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  height: 55vh;
  padding-left:8%
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  
  div.stat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div.stat-label {
    font-size: 2vh;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }

  div.stat-box {
    background-color: #bd0913;  // Neon gradient effect
    padding: 0.5rem 1.5rem;
    border-radius: 10px;
    font-size: 1.5rem;
    width: 100px;
    text-align: center;
    transition: all 0.3s ease;
    height: 40px;

    &:hover {
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
      transform: translateY(-5px);
    }
  }
`;

// const WinnerCard = styled.div`
//   width: 80%;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   div.image-container {
//     width: 300px;
//     height: 215px;
//     position: relative;
//     border-radius: 5%;
//     overflow: hidden;  // Ensures the image stays within the rounded container

//     background: rgba(255, 255, 255, 0.1);  // Transparent background for the glass effect
//     backdrop-filter: blur(15px);  // Apply the blur effect for the glass effect
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  // Optional shadow for realism

//     // Ensure that there is a background (like a soft gradient or blur) behind the image
//     background-image: url("https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
//     background-size: cover;
//     background-position: center;

//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   img {
//     width: 100%;  // Ensure image takes up the full container
//     height: 100%;
//     object-fit: cover;  // Ensure the image covers the container area without stretching
//   }

//   div.rank {
//     font-size: 2rem;
//     margin-top: 0.5rem;
//     sup {
//       font-size: 0.8rem;
//       vertical-align: super;
//     }
//   }

//   div.team-name {
//     font-size: 2.5rem;
//     text-align: center;
//     color: #1c4289;
//   }
// `;

const WinnerCard = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  div.image-container {
    width: 40vh;
    height: 30vh;
    position: relative;
    border-radius: 5%;
    overflow: hidden;
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-image: url("https://cdn.dribbble.com/users/3193430/screenshots/9448536/media/c141c6552f08c29487e92ed6b0f6ca1a.jpg?resize=1000x750&vertical=center");
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Overlay to add the shade */
  div.image-container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgb(255 58 58 / 5%);
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1; /* Ensure the image is above the overlay */
  }

  div.rank {
    font-size: 3vh;
    sup {
      font-size: 0.8rem;
      vertical-align: super;
    }
  }

  div.team-name {
    font-size: 2.5rem;
    text-align: center;
    color: #ffd5df;
    position: relative;
    display: inline-block;
    text-shadow: 
      1px 1px 0px #eb3d3d, /* Bottom right */
      -1px 1px 0px #eb3d3d, /* Bottom left */
      1px -1px 0px #eb3d3d, /* Top right */
      -1px -1px 0px #eb3d3d, /* Top left */
      0px 1px 0px #eb3d3d,  /* Bottom */
      0px -1px 0px #eb3d3d, /* Top */
      1px 0px 0px #eb3d3d,  /* Right */
      -1px 0px 0px #eb3d3d;  /* Left */
  }
`;




const AllTeams = styled.div`
  width: 40%;
  overflow-y: auto;
  font-weight: lighter;
`;
const TableHeader = styled.div`
  display: flex;
  
  margin-bottom: 0.5rem;


  & > div:nth-child(n + 2) {  // Select all children starting from the second one
      background-color: rgba(255, 58, 58, 0.2);
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
    box-shadow: 0 0 20px rgba(255, 0, 75, 0.7);
    animation: ${glow} 1.5s infinite alternate;
  }
`;

const MedalColumn = styled.div`
  width: 5%;
  text-align: center;
  font-size: 1.2rem;
  background: transparent;
`;


const RankColumn = styled.div`
  width: 15%;
  text-align: center;
  font-size: 1.4rem;
  background: transparent;
  font-weight: 600;
`;

const TeamNameColumn = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(243, 8, 8, 0.1) 0%, rgba(207, 15, 58, 0.3) 50%, transparent 100%);
  padding-left: 10px;  // Adjust padding to match your design
  font-size: 1.1rem;

  img {
    width: 30px;
    height: 30px;
    margin-right: 1rem;
  }
`;



const OtherColumns = styled.div`
  width: 10%; // Reduce the width to make it smaller
  text-align: center;
  font-size: 1.4rem; // Reduce the font size
  background: #2f1e1e; // Green background
  padding: 0.3rem 0.5rem; // Reduce padding for smaller boxes
  border-radius: 5px; // Rounded corners
  margin: 0 0.25rem; // Spacing between columns
  font-weight: 600;
`;

const MedalIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  color: #ff004b;  // Glowing Red for medals
  text-shadow: 0 0 10px #ff004b, 0 0 15px #ff004b;
`;
const OtherSection = styled.div`
  width: 20%;
  overflow-y: auto;
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
    background-color: #ff3a3a33;
  }

  &.next {
    /* Add specific styles for the "next" button */
    background-color: #ff3a3a33;
  }
`;

// Main Component with Pagination
const Dashboard = () => {
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
        <span className="match">MATCH</span>
        <span className="standings">STANDINGS</span>
      </TitleBar>
      <SubTitleBar>Heroes Tournament | Round 1</SubTitleBar>
      <Body>
        <WinnerTeam>
<WinnerCard>
  <div className="image-container">
    <img
      src="https://cdn.dribbble.com/users/3193430/screenshots/9448536/media/c141c6552f08c29487e92ed6b0f6ca1a.jpg?resize=1000x750&vertical=center"
      alt="Winner Logo"
    />
  </div>
  <div className="rank">
    1<sup>st</sup> Place
  </div>
  <div className="team-name">Team Alpha</div>
  <Stats>
    <div className="stat-container">
      <div className="stat-label">PLACE</div>
      <div className="stat-box">1</div>
    </div>
    <div className="stat-container">
      <div className="stat-label">ELIM</div>
      <div className="stat-box">10</div>
    </div>
    <div className="stat-container">
      <div className="stat-label">TOTAL</div>
      <div className="stat-box">100</div>
    </div>
  </Stats>
</WinnerCard>

        </WinnerTeam>
        <AllTeams>
        <TableHeader>
  <HeaderColumn align="left" width="20%"></HeaderColumn>
  <HeaderTeamColumn align="left" width="50%">
    TEAM
  </HeaderTeamColumn>
  <HeaderColumn align="center" width="10%">
    PLACE
  </HeaderColumn>
  <HeaderColumn align="center" width="10%">
    ELIM
  </HeaderColumn>
  <HeaderColumn align="center" width="10%">
    TOTAL
  </HeaderColumn>
</TableHeader>

          {currentTeams.map((team) => (
            <TableRow key={team.rank}>
              <MedalColumn>
              {team.rank === 1 && <MedalIcon>🥇</MedalIcon>}
                {team.rank === 2 && <MedalIcon>🥈</MedalIcon>}
                {team.rank === 3 && <MedalIcon>🥉</MedalIcon>}
              </MedalColumn>

              <RankColumn>
                {team.rank}
              </RankColumn>
              <TeamNameColumn>
                <img src={team.logo} alt={`${team.name} Logo`} />
                {team.name}
              </TeamNameColumn>
              <OtherColumns>{team.place}</OtherColumns>
              <OtherColumns>{team.elim}</OtherColumns>
              <OtherColumns>{team.total}</OtherColumns>
            </TableRow>
          ))}
        </AllTeams>
                  {/* Pagination Controls */}
                  <OtherSection>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{
              backgroundColor: "#ff3a3a33", // Button background color
              color: "white", // Text color
              border: "none", // Remove border if needed
              padding: "0.5rem 1rem", // Add padding
              borderRadius: "5px", // Rounded corners
              cursor: currentPage === 1 ? "not-allowed" : "pointer", // Change cursor based on page
              opacity: currentPage === 1 ? 0.5 : 1, // Adjust opacity when disabled
            }}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {Math.ceil(teams.length / rowsPerPage)}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(teams.length / rowsPerPage)}
              style={{
                backgroundColor: "#ff3a3a33", // Button background color
                color: "white", // Text color
                border: "none", // Remove border if needed
                padding: "0.5rem 1rem", // Add padding
                borderRadius: "5px", // Rounded corners
                cursor: currentPage === Math.ceil(teams.length / rowsPerPage) ? "not-allowed" : "pointer", // Change cursor based on page
                opacity: currentPage === Math.ceil(teams.length / rowsPerPage) ? 0.5 : 1, // Adjust opacity when disabled
              }}
            >
              Next
            </button>
          </div> */}
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
          </OtherSection>
      </Body>
    </MainPanel>
  );
};

export default Dashboard;
