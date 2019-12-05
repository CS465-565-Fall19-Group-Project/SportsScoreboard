import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import apis from "./scripts/apis";
import { Link } from "react-router-dom";
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
      lastPath: this.props.location.pathname,
      teams: [
        {
          team: {
            name: null,
            logo: null
          }
        }
      ]
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
  loadTeams(anchor, sport, league, overwrite) {
    apis.get_teams(sport, league).then(response => {
      const teams = response.map(element => {
        return {
          team: {
            name: element.name,
            logo: element.logos[0].href
          }
        };
      });
      this.spawnCards(anchor, sport, league, teams, overwrite);
    });
  }

  spawnCards(anchor, sport, league, teams, overwrite) {
    if (overwrite) {
      anchor.innerHTML = "";
    }
    //loop through all teams and create a card for each one!
    teams.forEach(function(element) {
      //create card container.

      var column = document.createElement("div");
      column.classList = "col-2 pl-1 mt-3";
      anchor.appendChild(column);

      var link = document.createElement("a");
      link.classList = "nav-link";
      link.href = "/Teams/" + sport + "/" + element.team.name + "-" + league;
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
      cardImage.width = "200px";
      //cardImage is a child of cardBody, so is cardTitle
      cardBody.appendChild(cardImage);

      //card title.
      var cardTitle = document.createElement("h6");
      cardTitle.classList = "card-title text-center";
      cardTitle.textContent = element.team.name;
      cardBody.appendChild(cardTitle);
    });
  }

  componentDidMount() {
    this.mount();
  }

  mount() {
    if (this.props.location.pathname === "/Teams/football") {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "football",
        "nfl",
        true
      );
    } else if (this.props.location.pathname === "/Teams/basketball") {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "basketball",
        "nba",
        true
      );
    } else if (this.props.location.pathname === "/Teams/hockey") {
      this.loadTeams(
        document.getElementById("append-to-me"),
        "hockey",
        "nhl",
        true
      );
    } else {
      const anchor = document.getElementById("append-to-me");
      anchor.innerHTML = "";
      this.loadTeams(anchor, "football", "nfl");
      this.loadTeams(anchor, "basketball", "nba");
      this.loadTeams(anchor, "hockey", "nhl");
    }
  }

  render() {
    //Servers as listener for pathname change and re-mounts teams accordingly
    if (this.props.location.pathname != this.state.lastPath) {
      this.state.lastPath = this.props.location.pathname;
      this.mount();
    }
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/Teams/football">
                  {" "}
                  Football{" "}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Teams/basketball">
                  {" "}
                  Basketball{" "}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Teams/hockey">
                  {" "}
                  Hockey
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div
          id="append-to-me"
          class="row"
          style={{ padding: "10px", margin: "0px" }}
        ></div>
      </div>
    );
  }
}
export default Teams;
