import React from "react";
import NavBar from "./NavBar";
import Home from "./Home";
import Teams from "./Teams";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as apis from "./scripts/apis";

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
        {/*
    **These files are not yet implemented. get rid of the comment when they are**

    <Route path="/Leaderboards/" component={Leaderboards} exact></Route>
    <Route path="/Match-history/" component={MatchHistory} exact></Route>
    */}
        <Route path="/Teams/" component={Teams} exact></Route>
        {/*<Route path="/" render={props => <Home {...props} />}></Route>*/}
        <Route path="/" component={Home} exact></Route>
      </Switch>
    </Router>
  );
}
export default App;
