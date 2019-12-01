import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import apis from "./scripts/apis";
import "bootstrap/dist/css/bootstrap.css";
import { Container, ListGroup, ListGroupItem, Row, Col } from "reactstrap";

class TeamInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      color: "",
      logo: "",
      stats: []
    };
  }

  getLocation() {
    return this.props.location.pathname;
  }

  parseUrl(anchor) {
    //Note, this url will always follow the same format.
    // /Teams/sport/team-league. When url gets split
    //index zero will be garbage and we dont need teams. So we only care about
    //index 2 and 3. Index 3 will also need to be split another time because the -
    var sport;
    var team;
    var league;

    var url = this.getLocation();
    url = url.split("/"); //url[2] = sport name

    var temp = url[3];
    temp = temp.split("-"); //temp[0] = team name temp[1] = league

    sport = url[2];
    team = temp[0];
    league = temp[1];

    this.loadTeam(anchor, sport, league, team); //sport , league
  }

  loadTeam(anchor, sport, league, name) {
    let currentComponent = this;
    apis.get_teams(sport, league).then(function(response) {
      console.log(response);
      response.forEach(function(element) {
        if (element.name === name) {
          console.log(element);
          console.log(element.record.items[0].stats);
          currentComponent.setState({
            displayName: element.displayName,
            color: element.color,
            logo: element.logos[0].href,
            stats: [
              ...currentComponent.state.stats,
              element.record.items[0].stats
            ]
          });
        }
      });
      currentComponent.spawnStats(anchor);
    });
  }

  spawnStats(anchor) {
    console.log(this.state.stats);
    this.state.stats[0].forEach(function(element) {
      console.log(element);
      var listItem = document.createElement("li");
      listItem.classList = "list-group-item";
      listItem.textContent = element.name + ": " + element.value;
      anchor.appendChild(listItem);
    });
  }

  componentDidMount() {
    var statsAnchor = document.getElementById("stats-anchor");
    this.parseUrl(statsAnchor);
  }

  render() {
    return (
      <Container className="justify-content-center">
        <Container id="team-intro">
          <h1 class="text-center">{this.state.displayName}</h1>
          <img
            class="mx-auto d-block"
            width="200"
            height="200"
            src={this.state.logo}
          ></img>
        </Container>
        <Container id="team schedule"></Container>
        <Container id="Team-stats">
          <h3 class="text-center">Stats</h3>
          <ul id="stats-anchor"></ul>
        </Container>
      </Container>
    );
  }
}
export default TeamInfo;
