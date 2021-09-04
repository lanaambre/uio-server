const http = require('http');
const { match } = require("path-to-regexp");

// TODO Déplacer la gestion de l'hôte et du port ailleurs
const host = 'localhost';
const port = 7890;

const getContext = require('./context');
const matchComponent = require('./router/matchComponent');

class App {
  constructor() {
    this.idIncrement = 0;
    this.components = [];
  }

  start() {
    const requestListener = async (req, res) => {
      console.time(`${req.method} ${req.url}`);

      const method = req.method.toLowerCase();
      const match = matchComponent(req, this.components);

      if (!(match && typeof match.component[method] === 'function')) {
        res.statusCode = 404;
        res.end('404 not found'); // TODO: better way to handle 404
        console.timeEnd(`${req.method} ${req.url}`);
        return;
      }

      const context = getContext(req, res, match, this);
      const resData = await match.component[method](context.proxy);

      res.end(resData);

      context.revoke();

      console.timeEnd(`${req.method} ${req.url}`);
    };

    const server = http.createServer(requestListener);

    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  }

  addIdToComponent(component) {
    this.idIncrement += 1;
    component.$$id = this.idIncrement;
  }

  add$$matchToComponent(component) {
    component.$$match = match(component.path, { decode: decodeURIComponent });
  }

  registerComponent(component) {
    this.addIdToComponent(component);
    this.add$$matchToComponent(component);

    this.components.push(component);

    return this;
  }

  registerComponents() {

  }

  registerDirectory() {

  }

  registerPlugin() {

  }

  registerPlugins() {

  }

  registerCron() {

  }

  registerCrons() {

  }

  registerCronsDirectory() {

  }

  registerCronsDirectories() {

  }
}

module.exports = App;
