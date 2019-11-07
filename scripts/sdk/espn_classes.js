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

  getEventsByCompetitor(searchString) {
    return this.events.filter(event => {
      return event.has_competitor(searchString);
    });
  }
}

class ESPNTeamSchedule {
  constructor() {
    this.timestamp = "";
    this.status = "";
    this.season = {};
    this.team = {};
    this.events = [];
    this.requestedSeason = {};
  }

  init(api_data) {
    Object.assign(this, api_data);
    //this.events = api_data.events.map(obj => new ESPNEvent().init(obj));
    return this;
  }

  getEventsByCompetitor(searchString) {
    return this.events.filter(event => {
      return event.has_competitor(searchString);
    });
  }
}

class ESPNTeam {
  /**
   * @constructor
   * @property {ESPNLeague[]} leagues
   * @property {ESPNEvent[]} events
   */
  constructor() {
    this.id = "";
    this.abbreviation = "";
    this.location = "";
    this.name = "";
    this.displayName = "";
    this.venueLink = "";
    this.clubhouse = "";
    this.color = "";
    this.logo = "";
    this.recordSummary = "";
    this.seasonSummary = "";
    this.standingsSummary = "";
    groups = {};
  }

  init(api_data) {
    Object.assign(this, api_data);
    this.events = api_data.events.map(obj => new ESPNEvent().init(obj));
    return this;
  }

  getEventsByCompetitor(searchString) {
    return this.events.filter(event => {
      return event.has_competitor(searchString);
    });
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

  has_competitor(name) {
    this.competitions.forEach(competitions => {
      if (competitions.has_competitor(name)) {
        return true;
      }
    });
    return false;
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

  has_competitor(name) {
    this.competitors.forEach(competitor => {
      if (competitor.is_match(name)) {
        return true;
      }
    });
    return false;
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

  /**
   * Method to determine if competitor is a match for search string.
   * Looks for partial match in full name or exact match for abbreviation
   * @param {string} searchString
   */
  is_match(searchString) {
    return (
      this.team.displayName.includes(searchString) ||
      this.team.abbreviation === searchString
    );
  }
}

module.exports = {
  ESPNScoreboard,
  ESPNTeamSchedule,
  ESPNTeam,
  ESPNLeague,
  ESPNEvent,
  ESPNCompetition,
  ESPNEventStatus,
  ESPNCompetitor
};
