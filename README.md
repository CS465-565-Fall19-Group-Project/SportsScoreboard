# SportsScoreboard

Custom sports scoreboard

## Browserify

Given that this project uses `node` and `require` modules in a web browser setting, there is a need to compile code in a manner that browsers understand.
To address this, we use the `browserify` package to create large files that contains all necessary code.

To use `browserify` when testing, run

```
browserify <file location> -o <new compiled file>
```

An example might be

```
browserify scripts/scoreboard.js -o scripts/web_scoreboard.js
```

Note that this is done from the main directory of the project and that we use the naming convention `web_<file name>` to distinguish between files
