import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
  Button
} from "reactstrap";
import TeamSearch from "./TeamSearch";
import Scoreboard from "./Scoreboard";

function Home() {
  const [trackedTeams, setTrackedTeams] = useState([]);

  const teamTracker = {
    getTeams: () => {
      return trackedTeams;
    },
    addTeam: teamString => {
      if (!trackedTeams.includes(teamString)) {
        trackedTeams.push(teamString);
        setTrackedTeams(trackedTeams);
      }
    },
    removeTeam: teamString => {
      const index = trackedTeams.indexOf(teamString);
      if (index >= 0) {
        trackedTeams.splice(index, 1);
        setTrackedTeams(trackedTeams);
      }
    }
  };

  const toggleVisible = bool => {
    const search = document.getElementById("searchContainer");
    const scores = document.getElementById("scoreboardContainer");
    if (bool) {
      search.style.display = "None";
      scores.style.display = "";
    } else {
      search.style.display = "";
      scores.style.display = "None";
    }
  };
  return (
    <div style={{ alignItems: "stretch" }}>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={() => {
                toggleVisible(false);
              }}
            >
              Find Teams
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => {
                toggleVisible(true);
              }}
            >
              View Scoreboard
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <Container id="searchContainer" style={{ padding: "10px" }}>
        <TeamSearch trackedTeams={trackedTeams} />
      </Container>
      <Container
        id="scoreboardContainer"
        style={{
          padding: "10px",
          display: "None"
        }}
      >
        <Scoreboard trackedTeams={trackedTeams}></Scoreboard>
      </Container>
    </div>
  );
}
export default Home;
