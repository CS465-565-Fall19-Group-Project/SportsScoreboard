const apis = require("./apis.js");

window.addEventListener("DOMContentLoaded", async () => {
  apis.get_schedule("football", "college-football", "oregon").then(schedule => {
    console.log(schedule);
  });

  apis.get_scoreboard("basketball", "nba").then(todays_nba_games => {
    console.log(todays_nba_games);
    console.log(todays_nba_games.getEventsByCompetitor("Portland"));
  });
});
