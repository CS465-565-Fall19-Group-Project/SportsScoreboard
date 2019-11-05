//File containing API calls to get score data
const axios = require("axios");

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

const get_scores = async (sport, league) => {
  const uri = `http://site.api.espn.com/apis/site/v2/sports/${sport}/${league.replace(
    /\\s/gi,
    "-"
  )}/scoreboard`;
  const params = {
    calendar: "blacklist",
    dates: get_date_string(new Date())
  };
  console.log(uri);
  console.log(params);

  return await get_data(uri, params);
};

let uri =
  "http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";
const params = {
  calendar: "blacklist",
  dates: "20191105"
};
const data = get_scores("basketball", "nba").then(output => {
  console.log(output);
  //console.log(output.events[0].competitions[0].competitors);
});
