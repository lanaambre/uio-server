const { match } = require("path-to-regexp");

const forEach = require('./../utils/forEach.js');
const httpMethods = require('./../utils/httpMethods.js');

class Component {
  id;
  app;
  rawconfig;
  name;
  path;

  match;

  constructor({ app, rawConfig }) {
    this.app = app;
    this.rawConfig = rawConfig;

    this.setup();
  }

  setup(config) {
    this.setup$name();
    this.setup$path();

    this.setup$methods();

    this.setup$plugins();

    this.check();
  }

  setup$id(id) {
    this.id = id;
  }

  setup$name() {
    this.name = this.rawConfig.name;
  }

  setup$path() {
    this.path = this.rawConfig.path;

    if (this.path.includes(':')) {
      const matcher = match(this.path, { decode: decodeURIComponent });

      this.match = matcher;

      return;
    }

    this.match = (url) => url === this.path;
  }

  setup$methods() {
    forEach((item, i) => {

    });

  }

  setup$plugins() {

  }

  check() {

  }
}

module.exports = Component;
