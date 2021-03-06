import React from "react";
import apis from "./scripts/apis";
import "bootstrap/dist/css/bootstrap.css";
import { Container } from "reactstrap";

class TeamInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      color: "",
      logo: "",
      stats: [],

      win: "",
      loss: "",

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
    this.loadScore(sport, league);
  }

  loadTeam(anchor, sport, league, name) {
    let currentComponent = this;
    apis.get_teams(sport, league).then(function(response) {
      response.forEach(function(element) {
        if (element.name === name) {
          var winLoss = element.record.items[0].summary;
          winLoss = winLoss.split("-");
          console.log(winLoss);

          currentComponent.setState({
            displayName: element.displayName,
            color: element.color,
            logo: element.logos[0].href,
            id: element.id,
            stats: [
              ...currentComponent.state.stats,
              element.record.items[0].stats
            ],
            win: winLoss[0],
            loss: winLoss[1]
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
          schedule: [...currentComponent.state.schedule, element],
          id: id
        });
      });
      currentComponent.spawnSchedule(anchor);
    });
  }

  loadScore(sport, league) {
    apis.get_scoreboard(sport, league).then(function(response) {
      console.log(response);
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
    let id = this.state.id;

    this.state.schedule.forEach(function(element) {
      var temp = element.date;
      var date;
      var time;
      temp = temp.split("T");
      date = temp[0];
      time = temp[1];
      time = time.replace(/Z/g, "").trim();

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

      var winOrLossElement = document.createElement("td");
      winOrLossElement.innerText = "TBD";
      if (element.competitions[0].attendance) {
        element.competitions[0].competitors.forEach(function(element) {
          if (element.id == id) {
            if (element.winner) {
              winOrLossElement.innerText = "Win";
              winOrLossElement.style.color = "green";
            } else {
              winOrLossElement.innerText = "Loss";
              winOrLossElement.style.color = "red";
            }
          }
        });
      }
      tr.appendChild(winOrLossElement);
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

  componentWillUnmount() {
    document.body.style.backgroundColor = "white";
  }

  render() {
    return (
      <Container
        style={{ backgroundColor: "white" }}
        className="justify-content-center"
      >
        {this.setBackground()}
        <Container id="team-intro">
          <h1 class="text-center">{this.state.displayName}</h1>
          <img
            class="mx-auto d-block"
            width="200"
            height="200"
            src={this.state.logo}
          ></img>
          <div class="container text-center mb-5">
            <h2 class="d-inline" style={{ color: "green" }}>
              {this.state.win}
            </h2>
            <h2 class="d-inline">-</h2>
            <h2 class="d-inline" style={{ color: "red" }}>
              {this.state.loss}
            </h2>
          </div>
        </Container>
        <h3 class="text-center">Schedule</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Game</th>
              <th scope="col">Win / Loss</th>
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
