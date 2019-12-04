import React from "react";
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

function Home() {
  const trackedTeams = [];
  return (
    <div style={{ alignItems: "stretch" }}>
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink>Tab1</NavLink>
          </NavItem>
          <NavItem>
            <NavLink>Moar Tabs</NavLink>
          </NavItem>
        </Nav>
      </div>
      <Container style={{ padding: "10px" }}>
        <TeamSearch trackedTeams={trackedTeams} />
      </Container>
    </div>
  );
}
export default Home;
