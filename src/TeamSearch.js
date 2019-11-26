import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import classnames from "classnames";
import apis from "./scripts/apis";
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Container,
  CardImg
} from "reactstrap";

const TeamSearchBar = ({ fieldToFuncDictionary }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col sm="8">
          <Form>
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
            <FormGroup id="leagueSelect">
              <Label for="leagueSelect">Sport</Label>
              <Input
                type="select"
                name="league"
                id="leagueSelectInput"
                onChange={fieldToFuncDictionary["league"].onChange}
              >
                {fieldToFuncDictionary["league"].getOptions()}
              </Input>
            </FormGroup>
            <InputGroup>
              <Input
                type="search"
                name="search"
                id="homeSearchBar"
                placeholder="Search for players or teams!"
              />
              <InputGroupAddon addonType="append">
                <Button>
                  <i class="fa fa-search"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </Col>
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

const TeamSearch = () => {
  const initialSport = Object.keys(EVENTMAPPING)[0];
  const initialLeague = Object.keys(EVENTMAPPING[initialSport])[0];
  const [sportValue, setSport] = useState(initialSport);
  const [leagueValue, setLeague] = useState(initialLeague);
  const [searchValue, setSearch] = useState("");

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
          console.log(value);
          return <option key={value}>{value.toUpperCase()}</option>;
        });
      },
      onChange: event => {
        setLeague(event.target.value.toLowerCase());
      }
    }
  };

  return (
    <Container>
      <TeamSearchBar fieldToFuncDictionary={data} />
    </Container>
  );
};

export default TeamSearch;
