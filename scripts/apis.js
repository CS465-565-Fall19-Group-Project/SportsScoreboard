//SOURCE: https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b

//File containing API calls to get score data
const axios = require("axios");
const ESPNObjects = require("./sdk/espn_classes.js");

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
 *
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

const get_scoreboard = async (sport, league) => {
  const uri = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league.replace(
    /\\s/gi,
    "-"
  )}/scoreboard`;
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

const get_schedule = async (sport, league, team) => {
  const uri = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league.replace(
    /\\s/gi,
    "-"
  )}/teams/${team}/schedule`;
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

/*let uri =
  "http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/ore/schedule";
const params = {};
const data = get_schedule("basketball", "nba", "portland").then(output => {
  console.log(output);
});*/

module.exports = {
  get_scoreboard,
  get_schedule
};
