import React, { Component, useState } from "react";
import classnames from "classnames";
import apis from "./scripts/apis";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
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
  CardImg
} from "reactstrap";

class Leaderboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      length: null,
      teams: [
        {
          team: {
            name: null,
            logo: null
          }
        }
      ]
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== this.state.tab) {
      this.setState({ activeTab: tab });
    }
  }
  handleClick() {
    apis.get_teams("basketball", "nba").then(
      response =>
        this.setState({ length: response.length }) +
        response.forEach(
          element =>
            this.setState(prevState => ({
              teams: [
                ...this.state.teams,
                {
                  team: {
                    name: element.name,
                    logo: element.logos[0].href
                  }
                }
              ]
            }))
          //for some reason, in this set state it is keeping the very first index as null.
          //However by doing .shift() it simply removes the first element so problem solved.
        ) +
        this.state.teams.shift() +
        console.log(this.state.teams) +
        this.spawnCard()
    );
  }

  loadBasketballTeams() {
    apis.get_teams("basketball", "nba").then(
      response =>
        this.setState({ length: response.length }) +
        response.forEach(
          element =>
            this.setState(prevState => ({
              teams: [
                ...this.state.teams,
                {
                  team: {
                    name: element.name,
                    logo: element.logos[0].href
                  }
                }
              ]
            }))
          //for some reason, in this set state it is keeping the very first index as null.
          //However by doing .shift() it simply removes the first element so problem solved.
        ) +
        this.state.teams.shift() +
        console.log(this.state.teams) +
        this.spawnCard()
    );
  }

  spawnCard() {
    //loop through all teams and create a card for each one!
    this.state.teams.forEach(function(element) {
      //create card container.
      var appendTo = document.getElementById("append");
      var card = document.createElement("div");
      card.classList = "card";
      appendTo.appendChild(card);

      //create card body container
      var cardBody = document.createElement("div");
      cardBody.clasList = "card-body";
      //append car Body to the card container.
      card.appendChild(cardBody);

      //card image
      var cardImage = document.createElement("img");
      cardImage.classList = "card-img-top";
      cardImage.alt = "team logo";
      cardImage.src = element.team.logo;
      //cardImage is a child of cardBody, so is cardTitle
      cardBody.appendChild(cardImage);

      //card title.
      var cardTitle = document.createElement("h6");
      cardTitle.classList = "card-title";
      cardTitle.textContent = element.team.name;
      cardBody.appendChild(cardTitle);
    });
  }
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Football
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2"); this.loadBasketballTeams();
              }}
            >
              Basketball
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            {this.state.activeTab == 1 ? <div id="tab1-append">Tab 1 Contents</div> : null}
          </TabPane>
          <TabPane tabId="2">
            {this.state.activeTab == 2 ? <h4>Tab 2 Contents</h4> : null}
          </TabPane>
        </TabContent>
        <div>
          <button className="button" onClick={this.handleClick}>
            Click Me
          </button>
          <div id="append"></div>
        </div>
      </div>
    );
  }
}
export default Leaderboards;
