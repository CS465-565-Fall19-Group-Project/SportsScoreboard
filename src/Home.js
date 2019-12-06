import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Nav, NavItem, NavLink } from "reactstrap";
import TeamSearch from "./TeamSearch";
import Scoreboard from "./Scoreboard";

function Home({ teamTracker }) {
  const [toggleSearch, setToggle] = useState(false);

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
