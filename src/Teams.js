import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis"
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Container,
  CardImg,
} from "reactstrap";

const Teams = props => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
      <Container>
      <Row>
        <Col sm="12" className="border">
          <Container>
            <Nav tabs className="justify-content-center">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  Football
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  Basketball
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    toggle("3");
                  }}
                >
                  Soccer
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "4" })}
                  onClick={() => {
                    toggle("4");
                  }}
                >
                  Golf
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "5" })}
                  onClick={() => {
                    toggle("5");
                  }}
                >
                  MMA
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <h4>Tab 1 Contents</h4>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="2" className="my-2">

                    <Card body>
                        <CardImg top width="100%"
                            src="https://usatftw.files.wordpress.com/2019/04/unknown-2.jpeg?w=1000&h=1000" alt="card-team-img"></CardImg>
                      <CardTitle>Trail Blazers</CardTitle>
                    </Card>
                  </Col>
                  <Col sm="2">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                    </Card>
                  </Col>
                  <Col sm="2">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                    </Card>
                  </Col>
                  <Col sm="2">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                    </Card>
                  </Col>
                  <Col sm="2">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                    </Card>
                  </Col>
                  <Col sm="2">
                    <Card body>
                      <CardTitle>Special Title Treatment</CardTitle>
                    </Card>
                  </Col>


                </Row>
              </TabPane>
            </TabContent>
          </Container>
        </Col>
{/*
        <Col sm="1"></Col>
        <Col className="border">
            <h3> Team Rankings </h3>
            <Row className="border-bottom border-top">
                <Col sm="2"> # </Col>
                <Col sm="3"> Team</Col>
                <Col sm="4"> Win/Loss</Col>
            </Row>
        </Col>
*/}
      </Row>
      </Container>
  );
};

export default Teams;
