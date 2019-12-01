import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
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
  return (
    <Container style={{ padding: "10px" }}>
      <TeamSearch />
    </Container>
  );
}
export default Home;
