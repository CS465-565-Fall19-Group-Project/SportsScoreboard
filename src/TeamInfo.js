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
      stats: [],

      id: "",
      schedule: []
    };
  }

  getLocation() {
    return this.props.location.pathname;
  }

  parseUrl(statsAnchor, scheduleAnchor) {
    //Note, this url will always follow the same format.
    // /Teams/sport/team-league. When url gets split
    //index zero will be garbage and we dont need teams. So we only care about
    //index 2 and 3. Index 3 will also need to be split another time because the -
    var sport;
    var team;
    var league;
    var id;

    var url = this.getLocation();
    url = url.split("/"); //url[2] = sport name

    var temp = url[3];
    temp = temp.split("-"); //temp[0] = team name temp[1] = league

    sport = url[2];
    team = temp[0];
    league = temp[1];
    id = temp[2];

    this.loadTeam(statsAnchor, sport, league, team); //sport , league
    this.loadSchedule(scheduleAnchor, sport, league, id);
  }

  loadTeam(anchor, sport, league, name) {
    let currentComponent = this;
    apis.get_teams(sport, league).then(function(response) {
      response.forEach(function(element) {
        if (element.name === name) {
          currentComponent.setState({
            displayName: element.displayName,
            color: element.color,
            logo: element.logos[0].href,
            id: element.id,
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

  loadSchedule(anchor, sport, league, id) {
    let currentComponent = this;
    apis.get_schedule(sport, league, id).then(function(response) {
      response.events.forEach(function(element) {
        currentComponent.setState({
          schedule: [...currentComponent.state.schedule, element]
        });
      });
      currentComponent.spawnSchedule(anchor);
    });
  }

  spawnStats(anchor) {
    this.state.stats[0].forEach(function(element) {
      var listItem = document.createElement("li");
      listItem.classList = "list-group-item";

      //capitalise the first letter and add spaces between words!
      var description = element.name;
      description =
        description.charAt(0).toUpperCase() + description.substring(1);
      description = description.replace(/([A-Z])/g, " $1").trim();

      listItem.textContent = description + ": " + element.value;
      anchor.appendChild(listItem);
    });
  }

  spawnSchedule(anchor) {
    var counter = 0;

    console.log(this.state.schedule);
    this.state.schedule.forEach(function(element) {
      console.log(element.name);

      var temp = element.date;
      var date;
      var time;
      temp = temp.split("T");
      date = temp[0];
      time = temp[1];
      time = time.replace(/Z/g,"").trim();
      console.log(date);

      var tr = document.createElement("tr");
      anchor.appendChild(tr);

      var th = document.createElement("th");
      th.scope = "row";
      th.innerText = counter;
      tr.appendChild(th);

      var dateElement = document.createElement("td");
      dateElement.innerText = date;
      tr.appendChild(dateElement);

      var timeElement = document.createElement("td");
      timeElement.innerText = time;
      tr.appendChild(timeElement);

      var nameElement = document.createElement("td");
      nameElement.innerText = element.name;
      tr.appendChild(nameElement);
      counter++;
    });
  }

  setBackground() {
    document.body.style.backgroundColor = `#${this.state.color}`;
  }

  componentDidMount() {
    var statsAnchor = document.getElementById("stats-anchor");
    var scheduleAnchor = document.getElementById("schedule-anchor");
    this.parseUrl(statsAnchor, scheduleAnchor);
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: "white" }}
        className="justify-content-center"
      >
        {" "}
        {this.setBackground()}
        <Container id="team-intro">
          <h1 class="text-center">{this.state.displayName}</h1>
          <img
            class="mx-auto d-block"
            width="200"
            height="200"
            src={this.state.logo}
          ></img>
        </Container>
        <h3 class="text-center">Schedule</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Game</th>
            </tr>
          </thead>
          <tbody id="schedule-anchor"></tbody>
        </table>
        <Container id="team-stats">
          <ul id="stats-anchor" class="pb-5 pl-0">
            <h3 class="text-center">Stats</h3>
          </ul>
        </Container>
      </Container>
    );
  }
}
export default TeamInfo;
