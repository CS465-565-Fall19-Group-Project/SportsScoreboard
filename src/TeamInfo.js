import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import apis from "./scripts/apis";
import "bootstrap/dist/css/bootstrap.css";


class TeamInfo extends React.Component{
constructor(props){
    super(props);
    this.state = {
        displayName: '',
        color: '',
        logo: '',
        stats: [],
    }
};

getLocation(){
    return this.props.location.pathname;
}

parseUrl(){
    //Note, this url will always follow the same format.
    // /Teams/sport/team-league. When url gets split
    //index zero will be garbage and we dont need teams. So we only care about
    //index 2 and 3. Index 3 will also need to be split another time because the -
    var url = this.getLocation();
    url = url.split("/"); //url[2] = sport name
    var temp = url[3];
    temp = temp.split("-"); //temp[0] = team name temp[1] = league

    this.loadTeam(url[2], temp[1], temp[0]); //sport , league
}

loadTeam(sport, league, name){

    let currentComponent = this;
    apis.get_teams(sport, league)
        .then(function(response){
            console.log(response);
            response.forEach(function(element){
                if(element.name === name){
                    console.log(element);
                    console.log(element.record.items[0].stats);
                    currentComponent.setState({
                        displayName: element.displayName,
                        color: element.color,
                        logo: element.logos[0].href,
                    })
                }
            })
        })
}

componentDidMount(){
    this.parseUrl();
}

render(){
    return(
        <div class = "bg-primary">{this.state.displayName}</div>
    );
}
}
export default TeamInfo;