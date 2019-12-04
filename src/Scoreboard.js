import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis";
import {
  Card,
  CardImg,
  CardTitle,
  CardDeck,
  Table,
  Image,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Container
} from "reactstrap";
import { get } from "http";

class ScoreCard extends React.Component {
  constructor(props) {
    super(props);
    console.log("orosd");
    console.log(props);
  }

  render() {
    const team1 = this.props.competition.competitors[0];
    const team2 = this.props.competition.competitors[1];
    console.log("tttt");
    console.log(team1.score != null);
    const compDate = new Date(this.props.competition.date);
    const display1 =
      team1.score != null ? team1.score.value : compDate.toLocaleDateString();
    const display2 =
      team2.score != null ? team2.score.value : compDate.toLocaleTimeString();
    return (
      <Card
        style={{
          height: "300px",
          width: "300px",
          margin: "10px",
          fontSize: "32px"
        }}
      >
        <CardTitle style={{ textAlign: "center" }}>
          {this.props.type} Game
        </CardTitle>
        <Row
          className="justify-content-md-center d-flex align-items-center"
          style={{ height: "45%", fontSize: "24px" }}
        >
          <CardImg
            src={team1.team.logos[0].href}
            alt={`${team1.team.abbreviation} logo`}
            style={{ height: "80%", width: "auto" }}
          ></CardImg>{" "}
          {`${team1.team.abbreviation} ${display1}`}
        </Row>
        <Row
          className="justify-content-md-center d-flex align-items-center"
          style={{ height: "45%", fontSize: "24px" }}
        >
          <CardImg
            src={team2.team.logos[0].href}
            alt={`${team2.team.abbreviation} logo`}
            style={{ height: "80%", width: "auto" }}
          ></CardImg>{" "}
          {`${team2.team.abbreviation} ${display2}`}
        </Row>
      </Card>
    );
  }
}

class TeamScoreCard extends React.Component {
  constructor(props) {
    super(props);
    //Initalize initial state - fill when compontent mounts (see componentDidMount())
    this.state = {
      teamData: {
        team: this.props.teamString.split("!"),
        games: null
      }
    };
  }

  findMostRecentGames(espnSchedule) {
    let output = {
      prev: null,
      live: null,
      next: null
    };
    const now = new Date().toISOString();
    for (let i = 0; i < espnSchedule.events.length; i++) {
      let game = espnSchedule.events[i];
      if (game.date < now) {
        output.prev = game;
      } else {
        output.next = game;
        return output;
      }
    }

    return output;
  }

  async getData(teamString) {
    //Get data
    const keys = teamString.split("!");
    console.log(keys);
    const schedule = await apis.get_schedule(...keys);
    if (schedule != null) {
      return {
        team: schedule.team,
        games: this.findMostRecentGames(schedule)
      };
    } else {
      return {
        team: keys,
        games: null
      };
    }
  }

  //Do async stuff here, which will repopulate data
  async componentDidMount() {
    const response = await this.getData(this.props.teamString);
    this.setState({ teamData: response });
  }

  render() {
    //Process data
    let href = "";
    let teamName = "";
    let backgroundColor = "#000000";
    let prevOrLiveScoreCard = (
      <Card
        style={{
          height: "300px",
          width: "300px",
          margin: "10px"
        }}
      ></Card>
    );
    let nextScoreCard = (
      <Card
        style={{
          height: "300px",
          width: "300px",
          margin: "10px"
        }}
      ></Card>
    );
    if (this.state.teamData.games == null) {
      teamName = this.state.teamData.team.join(" ");
    } else {
      teamName = this.state.teamData.team.displayName;
      href = this.state.teamData.team.getLogos()[0];
      backgroundColor = this.state.teamData.team.getColors()[0];
      if (this.state.teamData.games.prev != null) {
        console.log("comp)");
        console.log(this.state.teamData.games.prev.competitions[0]);
        prevOrLiveScoreCard = (
          <ScoreCard
            competition={this.state.teamData.games.prev.competitions[0]}
            type="Previous"
          ></ScoreCard>
        );
      }
      if (this.state.teamData.games.next != null) {
        nextScoreCard = (
          <ScoreCard
            competition={this.state.teamData.games.next.competitions[0]}
            type="Next"
          ></ScoreCard>
        );
      }
    }
    return (
      <CardDeck
        key={`${teamName}Card`}
        style={{
          margin: "10px",
          textAlign: "left"
        }}
      >
        <Card
          key={teamName}
          style={{
            height: "300px",
            width: "300px",
            margin: "10px",
            textAlign: "center"
          }}
          onChange={() => {
            console.log("CHanged");
          }}
        >
          <CardImg
            top
            src={href}
            alt={`${teamName} logo`}
            style={{
              height: "90%",
              width: "90%",
              backgroundColor: backgroundColor,
              margin: "auto"
            }}
          ></CardImg>
          <CardTitle>{teamName}</CardTitle>
        </Card>
        {prevOrLiveScoreCard}
        {nextScoreCard}
      </CardDeck>
    );
  }
}

const Scoreboard = ({ teamTracker }) => {
  console.log("Rendering Scoreboard");
  return teamTracker.getTeams().map(teamString => {
    return <TeamScoreCard teamString={teamString}></TeamScoreCard>;
  });
};

export default Scoreboard;
