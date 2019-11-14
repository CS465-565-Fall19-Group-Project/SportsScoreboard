//SOURCE: https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b

//File containing API calls to get score data
import * as axios from "axios";
import * as ESPNObjects from "./sdk/espn_classes.js.js";

/**
 * Method to convert a Date object into string form 'YYYYMMDD' required for ESPN API parameters
 * @param {object} Date object to convert
 */
const get_date_string = date => {
  return date
    .toISOString()
    .split("T")[0]
    .replace(/-/gi, "");
};

/**
 * Generic method for getting data from API call
 * @param {string} uri  URI string or request
 * @param {object} params JSON object mapping query parameter to a value (e.g. { foo: bar, foo2: baz })
 */
const get_data = async (uri, params) => {
  const options = {
    method: "get",
    url: uri,
    params: params,
    responseType: "json"
  };
  return await axios(options)
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      console.log(`Error processing request: ${err}`);
      return null;
    });
};

/**
 * Method to get scoreboard for TODAYs games for a given sport/league
 * @param {string} sport
 * @param {string} league
 * @return {ESPNScoreboard}
 */
export const get_scoreboard = async (sport, league) => {
  const uri = `https://site.api.espn.com/apis/site/v2/sports/${sport.toLowerCase()}/${league
    .toLowerCase()
    .replace(/\s/gi, "-")}/scoreboard`;
  const params = {
    calendar: "blacklist",
    dates: get_date_string(new Date())
  };

  const scoreboard = await get_data(uri, params);
  if (scoreboard != null) {
    return new ESPNObjects.ESPNScoreboard().init(scoreboard);
  } else {
    console.log(
      `Cannot get scoreboard for sport=${sport} and league=${league}`
    );
    return null;
  }
};

/**
 * Method to get a full schedule for a team in a given sport/league
 * @param {string} sport
 * @param {string} league
 * @param {string} team Partial team name or abbreviation (search functionality, not positive what will match so be clear as possible)
 * @return {ESPNTeamSchedule}
 */
export const get_schedule = async (sport, league, team) => {
  const uri = `https://site.api.espn.com/apis/site/v2/sports/${sport.toLowerCase()}/${league
    .toLowerCase()
    .replace(/\s/gi, "-")}/teams/${team}/schedule`;
  const params = {};

  const schedule = await get_data(uri, params);
  if (schedule != null) {
    return new ESPNObjects.ESPNTeamSchedule().init(schedule);
  } else {
    console.log(
      `Cannot get schedule for sport=${sport}, league=${league}, and team=${team}`
    );
    return null;
  }
};

/**
 * Method to get a list of all teams for a sport and league
 * @param {string} sport
 * @param {string} league
 * @return {ESPNTeam[]}
 */
export const get_teams = async (sport, league) => {
  const uri = `https://site.api.espn.com/apis/site/v2/sports/${sport.toLowerCase()}/${league
    .toLowerCase()
    .replace(/\s/gi, "-")}/teams`;
  const params = {
    limit: 1000
  };
  const output = await get_data(uri, params);
  if (output != null) {
    return output.sports[0].leagues[0].teams.map(t =>
      new ESPNObjects.ESPNTeam().init(t.team)
    );
  } else {
    console.log(`Cannot get teams for sport=${sport} and league=${league}`);
    return null;
  }
};

/*let uri =
  "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams";
const params = {
  limit: 1000
};

const data = get_schedule("basketball", "nba", "por").then(output => {
  console.log(output.events[0]);
});*/

module.exports = {
  get_scoreboard,
  get_schedule,
  get_teams
};
