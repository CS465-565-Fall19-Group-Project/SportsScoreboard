import React from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import Teams from "./Teams";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as apis from "./scripts/apis";
import TeamInfo from "./TeamInfo";

function App() {
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
        <Route path="/" component={Home} exact></Route>

        {/* These routes are in the teams class*/}
        <Route path="/Teams/football" component={Teams} exact></Route>
        <Route path="/Teams/basketball" component={Teams} exact></Route>
        <Route path="/Teams/hockey" component={Teams} exact></Route>
        <Route path="/Teams/football/:team" component={TeamInfo} exact></Route>
        <Route path="/Teams/basketball/:team" component={TeamInfo} exact></Route>
        <Route path="/Teams/hockey/:team" component={TeamInfo} exact></Route>
      </Switch>
    </Router>
  );
}
export default App;
