class ESPNScoreboard {
  /**
   * @constructor
   * @property {ESPNLeague[]} leagues
   * @property {ESPNEvent[]} events
   */
  constructor() {
    this.leagues = [];
    this.events = [];
  }

  init(api_data) {
    this.leagues = api_data.leagues.map(obj => new ESPNLeague().init(obj));
    this.events = api_data.events.map(obj => new ESPNEvent().init(obj));
    return this;
  }
}

class ESPNLeague {
  /**
   * @constructor
   * @property {string[]} calendars Array of UTC string  representing days in which league has games
   */
  constructor() {
    this.id = "";
    this.uid = "";
    this.name = "";
    this.abbreviation = "";
    this.slug = "";
    this.season = {};
    this.calendarType = "";
    this.calendarIsWhitelist = true;
    this.calendarStartDate = new Date().toUTCString();
    this.calendarEndDate = new Date().toUTCString();
    this.calendar = [];
  }

  init(data) {
    Object.assign(this, data);
    return this;
  }
}

class ESPNEvent {
  constructor() {
    this.id = "";
    this.uid = "";
    this.name = "";
    this.shortName = "";
    this.season = {};
    this.competitions = [];
    this.links = [];
    this.status = {};
  }

  init(data) {
    Object.assign(this, data);
    this.competitions = data.competitions.map(obj =>
      new ESPNCompetition().init(obj)
    );
    this.status = new ESPNEventStatus().init(data.status);
    return this;
  }
}

class ESPNCompetition {
  constructor() {
    this.id = "";
    this.uid = "";
    this.date = "";
    this.attendance = "";
    this.type = {};
    this.timeValid = true;
    this.neutralSite = false;
    this.conferenceCompetition = false;
    this.recent = false;
    this.venue = {};
    this.competitors = [];
    this.notes = [];
    this.status = {};
    this.broadcasts = [];
    this.tickets = [];
    this.startDate = "";
    this.geoBroadcasts = [];
    this.odds = [];
  }

  init(data) {
    Object.assign(this, data);
    this.competitors = data.competitors.map(obj =>
      new ESPNCompetitor().init(obj)
    );
    this.status = new ESPNEventStatus().init(data.status);
    return this;
  }
}

class ESPNEventStatus {
  constructor() {
    this.clock = 0;
    this.displayClock = "";
    this.period = 0;
    this.type = {
      id: "",
      name: "",
      state: "",
      completed: false,
      description: "",
      detail: "",
      shortDetail: ""
    };
  }

  init(data) {
    Object.assign(this, data);
    return this;
  }
}

class ESPNCompetitor {
  constructor() {
    this.id = "";
    this.uid = "";
    this.type = "team";
    this.order = 0;
    this.homeAway = "home";
    this.team = {};
    this.score = "";
    this.statistics = [];
    this.records = [];
    this.leaders = [];
  }

  init(data) {
    Object.assign(this, data);
    return this;
  }
}

module.exports = {
  ESPNScoreboard,
  ESPNLeague,
  ESPNEvent,
  ESPNCompetition,
  ESPNEventStatus,
  ESPNCompetitor
};
