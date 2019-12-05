import React, { useState } from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import Teams from "./Teams";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as apis from "./scripts/apis";
import TeamInfo from "./TeamInfo";

function App() {
  const [trackedTeams, setTrackedTeams] = useState([]);

  const teamTracker = {
    getTeams: () => {
      return trackedTeams;
    },
    containsTeam: teamString => {
      return trackedTeams.includes(teamString);
    },
    addTeam: teamString => {
      if (!trackedTeams.includes(teamString)) {
        trackedTeams.push(teamString);
        setTrackedTeams(trackedTeams);
      }
    },
    removeTeam: teamString => {
      const index = trackedTeams.indexOf(teamString);
      if (index >= 0) {
        trackedTeams.splice(index, 1);
        setTrackedTeams(trackedTeams);
      }
    }
  };

  return (
    <Router>
      <NavBar />
      {/*
       Using the Browser router package, clicking on a link in the navbar will change the route,
        Now that the path is changed <Route> will execute the js file specific to the route. Now
        we can seperate each page into its own javascript file for better organization.
    */}
      <Switch>
        {/*<Route path="/Match-history/" component={MatchHistory} exact></Route>*/}
        <Route path="/Teams/" component={Teams} exact></Route>
        {/*<Route path="/" render={props => <Home {...props} />}></Route>*/}
        <Route
          path="/"
          render={props => <Home teamTracker={teamTracker} />}
          exact
        ></Route>

        {/* These routes are in the teams class*/}
        <Route
          path="/Teams/football"
          render={props => <Teams location={{ pathname: "/Teams/football" }} />}
          exact
        ></Route>
        <Route
          path="/Teams/basketball"
          render={props => (
            <Teams location={{ pathname: "/Teams/basketball" }} />
          )}
          exact
        ></Route>
        <Route
          path="/Teams/hockey"
          render={props => <Teams location={{ pathname: "/Teams/hockey" }} />}
          exact
        ></Route>
        <Route path="/Teams/football/:team" component={TeamInfo} exact></Route>
        <Route
          path="/Teams/basketball/:team"
          component={TeamInfo}
          exact
        ></Route>
        <Route path="/Teams/hockey/:team" component={TeamInfo} exact></Route>
      </Switch>
    </Router>
  );
}
export default App;
