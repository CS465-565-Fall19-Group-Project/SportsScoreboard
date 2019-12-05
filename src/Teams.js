import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import apis from "./scripts/apis";
import { BrowserRouter as Router } from "react-router-dom";
import {
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  NavbarBrand,
  Navbar,
  Collapse
} from "reactstrap";

class Teams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      teams: [
        {
          team: {
            name: null,
            logo: null,
            id: null
          }
        }
      ]
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  loadTeams(anchor, sport, league) {
    apis.get_teams(sport, league).then(
      response =>
        response.forEach(
          element =>
            this.setState(prevState => ({
              teams: [
                ...this.state.teams,
                {
                  team: {
                    name: element.name,
                    logo: element.logos[0].href,
                    id: element.id
                  }
                }
              ]
            }))
          //for some reason, in this set state it is keeping the very first index as null.
          //However by doing .shift() it simply removes the first element so problem solved.
        ) +
        this.state.teams.shift() +
        this.spawnCard(anchor, sport, league)
    );
  }

  spawnCard(anchor, sport, league) {
    //loop through all teams and create a card for each one!
    this.state.teams.forEach(function(element) {
      //create card container.

      var column = document.createElement("div");
      column.classList = "team col-2 pl-1 mt-3";
      column.id = element.team.name;
      anchor.appendChild(column);

      var link = document.createElement("a");
      link.href =
        "/Teams/" +
        sport +
        "/" +
        element.team.name +
        "-" +
        league +
        "-" +
        element.team.id;
      link.style = "text-decoration: none; color:black;";
      column.appendChild(link);

      var card = document.createElement("div");
      card.classList = "card";
      link.appendChild(card);

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
      cardImage.height = "250";
      //cardImage is a child of cardBody, so is cardTitle
      cardBody.appendChild(cardImage);

      //card title.
      var cardTitle = document.createElement("h6");
      cardTitle.classList = "card-title text-center";
      cardTitle.textContent = element.team.name;
      cardBody.appendChild(cardTitle);
    });
  }

  searchTeam() {
    console.log("test");
    var input, filter, container, card, i, id
    if(document.getElementById("search-bar")){

    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    }
    if(document.getElementById("append-to-me")){

    container = document.getElementById("append-to-me");
    card = container.getElementsByTagName("div");
    console.log(card);

    for(i = 0; i<card.length;i++){
    }
    }
  }

  componentDidMount() {
    if (this.props.location.pathname === "/Teams/football") {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "football",
        "nfl"
      );
    } else if (this.props.location.pathname === "/Teams/basketball") {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "basketball",
        "nba"
      );
    } else if (this.props.location.pathname === "/Teams/hockey") {
      this.loadTeams(document.getElementById("append-to-me"), "hockey", "nhl");
    } else {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "football",
        "nfl"
      );
      this.loadTeams(
        document.getElementById("append-to-me"),
        "basketball",
        "nba"
      );
      this.loadTeams(document.getElementById("append-to-me"), "hockey", "nhl");
    }
  }

  setBackground() {
    document.body.style.backgroundColor = "white";
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/Teams/football"> Football </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/Teams/basketball"> Basketball </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/Teams/hockey"> Hockey</NavLink>
                </NavItem>
                  <input
                    onKeyUp={this.searchTeam()}
                    class="mr-sm-2 float-right"
                    id="search-bar"
                    type="text"
                    name="search-bar"
                    placeholder="Search Teams"
                    aria-label="Search"
                  />
              </Nav>
            </Collapse>
          </Navbar>
          <div id="append-to-me" class="row">
            {this.setBackground()}
          </div>
        </div>
      </Router>
    );
  }
}
export default Teams;
