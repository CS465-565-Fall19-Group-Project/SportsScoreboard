export class ESPNScoreboard {
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

export class ESPNTeamSchedule {
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
    this.team = new ESPNTeamSummary().init(api_data.team);
    return this;
  }

  getEventsByCompetitor(searchString) {
    return this.events.filter(event => {
      return event.has_competitor(searchString);
    });
  }
}

export class ESPNTeam {
  /**
   * @constructor
   */
  constructor() {
    this.id = "";
    this.uid = "";
    this.slug = "";
    this.abbreviation = "";
    this.location = "";
    this.name = "";
    this.nickname = "";
    this.displayName = "";
    this.shortDisplayName = "";
    this.color = "";
    this.alternateColor = "";
    this.isActive = true;
    this.isAllStar = false;
    this.logos = [];
    this.record = [];
    this.links = [];
  }

  init(api_data) {
    Object.assign(this, api_data);
    return this;
  }

  getLogos() {
    return this.logos;
  }

  getColors() {
    let colors = [];
    if (this.color !== "") {
      colors.push(`#${this.color}`);
    }
    if (this.alternateColor !== "") {
      colors.push(`#${this.alternateColor}`);
    }
    if (colors.length === 0) {
      colors.push(`#000000`);
    }
    return colors;
  }
}

export class ESPNTeamSummary {
  /**
   * @constructor
   */
  constructor() {
    this.id = "";
    this.abbreviation = "";
    this.location = "";
    this.name = "";
    this.displayName = "";
    this.clubhouse = "";
    this.color = "";
    this.logo = "";
    this.logos = [];
    this.recordSummary = "";
    this.seasonSummary = "";
    this.standingsSummary = "";
    this.groups = {};
  }

  init(api_data) {
    Object.assign(this, api_data);
    return this;
  }

  getLogos() {
    return [this.logo];
  }

  getColors() {
    return [`#${this.color}`];
  }
}

export class ESPNLeague {
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

export class ESPNEvent {
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
    for (let i = 0; i < this.competitions.length; i++) {
      if (this.competitions[i].has_competitor(name)) {
        return true;
      }
    }
    return false;
  }
}

export class ESPNCompetition {
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
    for (let i = 0; i < this.competitors.length; i++) {
      if (this.competitors[i].is_match(name)) {
        return true;
      }
    }
    return false;
  }
}

export class ESPNEventStatus {
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

export class ESPNCompetitor {
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
