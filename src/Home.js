import React, { useState } from "react";
import ReactDOM from "react-dom";
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
  const [toggleSearch, setToggle] = useState(false);

  const teamTracker = {
    getTeams: () => {
      return trackedTeams;
    },
    containsTeam: teamString => {
      return trackedTeams.includes(teamString);
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

  const renderSearchOrScores = () => {
    if (toggleSearch) {
      return (
        <Container
          id="scoreboardContainer"
          style={{
            padding: "10px"
          }}
        >
          <Scoreboard teamTracker={teamTracker}></Scoreboard>
        </Container>
      );
    } else {
      return (
        <Container id="searchContainer" style={{ padding: "10px" }}>
          <TeamSearch teamTracker={teamTracker} />
        </Container>
      );
    }
  };
  return (
    <div style={{ alignItems: "stretch" }}>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              onClick={() => {
                setToggle(false);
              }}
            >
              Find Teams
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => {
                setToggle(true);
              }}
            >
              View Scoreboard
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      {renderSearchOrScores()}
    </div>
  );
}
export default Home;
