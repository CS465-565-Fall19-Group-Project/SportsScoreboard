import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis";
import {
  Card,
  CardImg,
  CardTitle,
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

/*const ScoreboardSearch = ({ trackedTeams }) => {
  let initialSport = Object.keys(EVENTMAPPING)[0];
  let initialLeague = Object.keys(EVENTMAPPING[initialSport])[0];
  const [sportValue, setSport] = useState(initialSport);
  const [leagueValue, setLeague] = useState(initialLeague);
  const [searchValue, setSearch] = useState("");
  const [teamValues, setTeams] = useState([]);

  const data = {
    sport: {
      getOptions: event => {
        return Object.keys(EVENTMAPPING).map(value => {
          return <option key={value}>{value.toUpperCase()}</option>;
        });
      },
      onChange: event => {
        let choice = event.target.value.toLowerCase();
        setSport(choice);
        console.log(EVENTMAPPING[choice]);
        setLeague(Object.keys(EVENTMAPPING[choice])[0]);
      }
    },
    league: {
      getOptions: event => {
        return Object.keys(EVENTMAPPING[sportValue]).map(value => {
          return <option key={value}>{value.toUpperCase()}</option>;
        });
      },
      onChange: event => {
        setLeague(event.target.value.toLowerCase());
      }
    },
    search: {
      onChange: event => {
        setSearch(event.target.value);
      },
      onSubmit: async event => {
        event.preventDefault();
        const leagueAbbrev = EVENTMAPPING[sportValue][leagueValue]; //Mapping may be different than name of league
        //trackedTeams.push(`${sportValue}!${leagueAbbrev}!${searchValue}`);
        const teams = await apis.get_teams(sportValue, leagueAbbrev);
        if (teams != null) {
          const searchedTeams = teams
            .filter(team => {
              return team.is_match(searchValue);
            })
            .map(team => {
              return {
                team: team,
                selected: false
              };
            });
          setTeams(searchedTeams);
        } else {
          setTeams([]);
        }
      }
    },
    teams: {
      //trackedTeams: trackedTeams,
      getRows: () => {
        if (teamValues.length == 0) {
          return (
            <tr>
              <th scope="row" colSpan="3" style={{ textAlign: "center" }}>
                No matching teams
              </th>
            </tr>
          );
        } else {
          return teamValues.map((tv, index) => {
            return (
              <tr
                key={tv.team.abbreviation}
                onChange={() => {
                  console.log("CHanged");
                }}
              >
                <th style={{ textAlign: "center" }}>
                  <Input
                    id={`teamSelected${index}`}
                    type="checkbox"
                    checked={tv.selected}
                    onChange={event => {
                      tv.selected = !tv.selected;
                      console.log(tv);
                    }}
                  />
                </th>
                <td>{tv.team.displayName}</td>
                <td></td>
              </tr>
            );
          });
        }
      },
      getCards: () => {
        console.log(this);
        if (teamValues.length == 0) {
          return (
            <Row
              className="justify-content-md-center"
              style={{ backgroundColor: "lightgray" }}
            >
              No matching teams
            </Row>
          );
        } else {
          return teamValues.map((tv, index) => {
            let href = "";
            if (tv.team.getLogos().length > 0) {
              href = tv.team.getLogos()[0].href;
            }
            return (
              <Card
                key={index}
                style={{ width: "200px", margin: "10px", textAlign: "center" }}
                onChange={() => {
                  console.log("CHanged");
                }}
              >
                <CardImg
                  top
                  src={href}
                  alt={`${tv.team.displayName} logo`}
                  style={{ backgroundColor: tv.team.getColors()[0] }}
                ></CardImg>
                <CardTitle>{tv.team.displayName}</CardTitle>
              </Card>
            );
          });
        }
      }
    }
  };

  return (
    <Container>
      <TeamSearchBar fieldToFuncDictionary={data} />
      <TeamSearchGrid fieldToFuncDictionary={data} />
    </Container>
  );
};*/

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
        console.log("done");
        return output;
      }
    }
    console.log("done");

    return output;
  }

  async getData(teamString) {
    //Get data
    const keys = teamString.split("!");
    const schedule = await apis.get_schedule(...keys);
    if (schedule != null) {
      console.log("bind");
      console.log(this);
      return {
        team: schedule.team,
        games: this.findMostRecentGames(schedule)
      };
    } else {
      console.log(keys);
      return {
        team: keys,
        games: null
      };
    }
  }

  //Do async stuff here, which will repopulate data
  async componentDidMount() {
    console.log("Mount");
    console.log(this);
    const response = await this.getData(this.props.teamString);
    this.setState({ teamData: response });
    console.log("response");
    console.log(response);
  }

  render() {
    //Process data
    let href = "";
    let teamName = "";
    let backgroundColor = "#000000";
    let prevOrLiveScoreCard;
    let nextScoreCard;
    if (this.state.teamData.games == null) {
      teamName = this.state.teamData.team.join(" ");
    } else {
      teamName = this.state.teamData.team.displayName;
      href = this.state.teamData.team.getLogos()[0];
      backgroundColor = this.state.teamData.team.getColors()[0];
    }
    console.log("returning");
    return (
      <Card key={`${teamName}Card`} style={{ margin: "10px" }}>
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
        {/**Prev/Live*/}
        {/**Next */}
      </Card>
    );
  }
}

const Scoreboard = ({ trackedTeams }) => {
  return trackedTeams.map(teamString => {
    return <TeamScoreCard teamString={teamString}></TeamScoreCard>;
  });
};

export default Scoreboard;
