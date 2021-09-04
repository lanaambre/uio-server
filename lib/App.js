const http = require('http');
const path = require('path');
const glob = require('glob');

const { match } = require("path-to-regexp");

// TODO Déplacer la gestion de l'hôte et du port ailleurs
const host = 'localhost';
const port = 7890;

const getContext = require('./context');
const matchComponent = require('./router/matchComponent');

class App {
  idIncrement = 0;
  components = [];
  rootPath = process.cwd();

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

  registerComponentByPath(componentPath) {
    let component;

    try {
      const fullPath = this.determinePath(componentPath);
      component = require(fullPath);
    } catch (e) {
      console.error('Fail to get component by path', componentPath, e);
      return this;
    }

    return this.registerComponent(component);
  }

  registerDirectory(directoryPath, addSearchExtension = true) {
    const searchExtension = addSearchExtension ? '**/*.js' : '';
    const fullPath = this.determinePath(directoryPath, searchExtension);

    let files = [];

    try {
      files = glob.sync(fullPath, {
        nodir: true,
      });
    } catch (e) {
      console.error('Fail to register directory', directoryPath, e);
      return this;
    }

    files.forEach((filePath) => {
      this.registerComponentByPath(filePath);
    });

    return this;
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

  determinePath(...paths) {
    const partialPath = path.join(...paths);

    return path.isAbsolute(partialPath)
      ? partialPath
      : path.join(this.rootPath, partialPath);
  }
}

module.exports = App;
