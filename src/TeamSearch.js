import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import apis from "./scripts/apis";
import {
  Card,
  CardImg,
  CardTitle,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Container
} from "reactstrap";

/**
 * React component representing the search bar that can filter teams by sport, league, and a search term.
 * Will do an API call to get all teams under the provided sport and league, then filter all teams on
 * the search term (looking for matches in team display name or abbreviation)
 */
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

/**
 * React component representing grid of cards populated by search results of TeamSearchBar
 * Most of the work is done in the fieldToFuncDictionary.teams.getCards() method which resides in
 * the TeamSearch component. This is done because this class needs access to a bunch of different shared values
 * so it was easier to implement at higher level (TeamSearch) and pass down to this component
 */
const TeamSearchGrid = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        {fieldToFuncDictionary["teams"].getCards()}
      </Row>
    </Container>
  );
};

/**
 * Object representing all possible sport and league combinations. `TEAMSMAPPING[sport][value]` returns the
 * league value used by the ESPN api calls, as it differs from the abbreviated name in some cases
 * NOTE: Some of these teams are commented out because their schedules cannot be found with a normal API route,
 * so using them populates empty scores. Removing for now
 */

const TEAMSMAPPING = {
  baseball: {
    mlb: "mlb"
  },
  basketball: {
    nba: "nba",
    wnba: "wnba"
    /*ncaam: "mens-college-basketball",
    ncaaw: "womens-college-basketball"*/
  },
  football: {
    nfl: "nfl",
    cfb: "college-football"
  },
  hockey: {
    nhl: "nhl"
  }
  /*soccer: {
    mls: "usa.1",
    nwsl: "usa.nwsl"
  }*/
};

/**
 * React component repreesnting the functionality to search and select teams for the scoreboard
 * Most of the work is in the `data` object which is passed to subcomponents. This is done because
 * the subcomponents, `TeamSearchBar` and `TeamSearchGrid` both need access to common data values
 * like the sport and league being searched. It was easier to implement at this higher level and pass
 * down even though it looks messier that I would like
 * This module helps track teams when clicked and passes information up to Home component, where information
 * is also transferred to the Scoreboard tab to populate schedules
 *
 * @param {object} teamTracker - Another data object passed down that helps track selected teams.
 */
const TeamSearch = ({ teamTracker }) => {
  let initialSport = Object.keys(TEAMSMAPPING)[0];
  let initialLeague = Object.keys(TEAMSMAPPING[initialSport])[0];
  const [sportValue, setSport] = useState(initialSport);
  const [leagueValue, setLeague] = useState(initialLeague);
  const [searchValue, setSearch] = useState("");
  const [teamValues, setTeams] = useState([]);

  const data = {
    sport: {
      getOptions: event => {
        return Object.keys(TEAMSMAPPING).map(value => {
          return <option key={value}>{value.toUpperCase()}</option>;
        });
      },
      onChange: event => {
        let choice = event.target.value.toLowerCase();
        setSport(choice);
        setLeague(Object.keys(TEAMSMAPPING[choice])[0]);
      }
    },
    league: {
      getOptions: event => {
        return Object.keys(TEAMSMAPPING[sportValue]).map(value => {
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
        console.log("Changing teams");
        event.preventDefault();
        const leagueAbbrev = TEAMSMAPPING[sportValue][leagueValue]; //Mapping may be different than name of league
        const teams = await apis.get_teams(sportValue, leagueAbbrev);
        if (teams != null) {
          const searchedTeams = teams
            .filter(team => {
              return team.is_match(searchValue);
            })
            .map(team => {
              const trackerValue = `${sportValue}!${leagueAbbrev}!${team.abbreviation.toLowerCase()}`;
              return {
                team: team,
                trackerValue: trackerValue,
                selected: teamTracker.containsTeam(trackerValue)
              };
            });
          setTeams(searchedTeams);
        } else {
          setTeams([]);
        }
      }
    },
    teams: {
      getCards: () => {
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
            const slug = tv.team.slug;
            let href = "";
            if (tv.team.getLogos().length > 0) {
              href = tv.team.getLogos()[0].href;
            }
            return (
              <div
                id={`team!${slug}`}
                style={{
                  padding: "5px",
                  margin: "5px"
                }}
              >
                <Card
                  style={{
                    width: "200px",
                    margin: "10px",
                    textAlign: "center"
                  }}
                  onLoad={() => {
                    //Onload, make sure proper value set
                    const a = document.getElementById(`team!${slug}`);
                    if (teamTracker.containsTeam(tv.trackerValue)) {
                      a.style.backgroundColor = "#00ff00";
                    } else {
                      a.style.backgroundColor = "#ffffff";
                    }
                  }}
                  onClick={() => {
                    const a = document.getElementById(`team!${slug}`);
                    if (teamTracker.containsTeam(tv.trackerValue)) {
                      teamTracker.removeTeam(tv.trackerValue);
                      a.style.backgroundColor = "#ffffff";
                    } else {
                      teamTracker.addTeam(tv.trackerValue);
                      a.style.backgroundColor = "#00ff00";
                    }
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
    </Container>
  );
};

export default TeamSearch;
