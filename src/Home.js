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
    <Container>
      <Row className="justify-content-md-center">
        <Col sm="3">
          <img
            src="https://cdn.freebiesupply.com/logos/large/2x/sports-logo-png-transparent.png"
            alt="website logo"
            width="200"
            height="200"
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col sm="8">
          <Form>
            <InputGroup>
              <Input
                type="search"
                name="search"
                id="homeSearchBar"
                placeholder="Search for players or teams!"
              />
              <InputGroupAddon addonType="append">
                <Button>
                  <i className="fa fa-search"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <TeamSearch />
    </Container>
  );
}
export default Home;
