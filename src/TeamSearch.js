import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis";
import {
  Table,
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

const TeamSearchGrid = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Selected</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>{fieldToFuncDictionary["teams"].getRows()}</tbody>
        </Table>
      </Row>
    </Container>
  );
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

const TeamSearch = props => {
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
        setLeague(EVENTMAPPING[choice]);
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
        const teams = await apis.get_teams(sportValue, leagueValue);
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
      getRows: () => {
        if (teamValues.length == 0) {
          return (
            <tr>
              <th scope="row">No matching teams</th>
            </tr>
          );
        } else {
          return teamValues.map((tv, index) => {
            return (
              <tr key={tv.team.abbreviation}>
                <th scope="row">{index}</th>
                <td>{tv.selected}</td>
                <td>{tv.team.displayName}</td>
              </tr>
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
