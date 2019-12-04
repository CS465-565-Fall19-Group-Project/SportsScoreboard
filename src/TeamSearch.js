import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis";
import Scoreboard from "./Scoreboard";
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

const TeamSearchBar = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Form onSubmit={fieldToFuncDictionary["search"].onSubmit}>
        <Row className="justify-content-md-center">
          <Col sm="2">
            <FormGroup id="sportSelect">
              <Label for="sportSelect">Sport</Label>
              <Input
                type="select"
                name="sport"
                id="sportSelectInput"
                onChange={fieldToFuncDictionary["sport"].onChange}
              >
                {fieldToFuncDictionary["sport"].getOptions()}
              </Input>
            </FormGroup>
          </Col>
          <Col sm="2">
            <FormGroup id="leagueSelect">
              <Label for="leagueSelect">League</Label>
              <Input
                type="select"
                name="league"
                id="leagueSelectInput"
                onChange={fieldToFuncDictionary["league"].onChange}
              >
                {fieldToFuncDictionary["league"].getOptions()}
              </Input>
            </FormGroup>
          </Col>
          <Col sm="4">
            <FormGroup id="searchInput">
              <Label for="searchInput">Team Filter</Label>
              <Input
                type="search"
                name="search"
                id="teamSearchInput"
                onChange={fieldToFuncDictionary["search"].onChange}
                placeholder="Search teams..."
              />
            </FormGroup>
          </Col>
          <Col sm="1">
            <FormGroup id="searchButton">
              <Label for="searchButton">Search</Label>
              <Button>
                <i className="fa fa-search"></i>
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const TeamSearchTable = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Table striped>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>Track</th>
              <th>Selected</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{fieldToFuncDictionary["teams"].getRows()}</tbody>
        </Table>
      </Row>
    </Container>
  );
};

const TeamSearchGrid = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        {fieldToFuncDictionary["teams"].getCards()}
      </Row>
    </Container>
  );
};

const map = function() {
  const users = this.users_tweeting.sort();
};

const EVENTMAPPING = {
  basketball: {
    nba: "nba",
    wnba: "wnba",
    ncaam: "mens-college-basketball",
    ncaaw: "womens-college-basketball"
  },
  soccer: {
    mls: "usa.1",
    nwsl: "nwsl.1"
  },
  football: {
    nfl: "nfl",
    cfb: "college-football"
  }
};

const TeamSearch = ({ trackedTeams }) => {
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
              <div
                id={`score${index}`}
                style={{
                  padding: "5px",
                  margin: "5px",
                  backgroundColor: "#ffffff"
                }}
                selected="false"
              >
                <Card
                  key={index}
                  style={{
                    width: "200px",
                    margin: "10px",
                    textAlign: "center"
                  }}
                  onClick={() => {
                    const a = document.getElementById(`score${index}`);
                    const value = `${sportValue}!${leagueValue}!${tv.team.abbreviation.toLowerCase()}`;
                    if (a.selected == "true") {
                      console.log("true");
                      a.style.backgroundColor = "#ffffff";
                      a.selected = "false";
                      const index = trackedTeams.indexOf(value);
                      if (index >= 0) {
                        trackedTeams.splice(index, 1);
                      }
                    } else {
                      console.log("false");
                      a.style.backgroundColor = "#00ff00";
                      a.selected = "true";
                      trackedTeams.push(value);
                    }
                    console.log("click");
                    console.log(trackedTeams);
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
              </div>
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
      <Scoreboard trackedTeams={trackedTeams}></Scoreboard>
    </Container>
  );
};

export default TeamSearch;
