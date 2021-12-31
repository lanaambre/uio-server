const colors = require('colors');
const glob = require('glob');
const http = require('http');
const path = require('path');

const { match } = require("path-to-regexp");

const httpMethods = require('./utils/httpMethods');

const getContext = require('./context');
const matchComponent = require('./router/matchComponent');

class App {
  components = [];
  idIncrement = 0;

  host;
  port;

  rootPath = process.cwd();
  server;
  started = false;

  constructor(config) {
    this.host = config?.host ?? 'localhost';
    this.port = config?.port ?? 7890;
  }

  start() {
    if (this.started) {
      console.warn('Server is already started');
      return;
    }

    const requestListener = async (req, res) => {
      const url = req.url;

      let matchedComponent;

      for (const component of this.components) {
        if (component.$$match(url)) {
          matchedComponent = component;
          break;
        }
      }

      const method = matchedComponent?.[req.method.toLowerCase()];

      if (method) {
        const context = getContext(req, res, matchedComponent, this);

        let resData;

        try {
          resData = await method.call(undefined, context.proxy);
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end('Internal server error');
          return;
        }

        res.end(resData);

        context.revoke();

        return;
      }

      res.statusCode = 404;
      res.end('404 not found'); // TODO: better way to handle 404
    };

    this.server = http.createServer(requestListener);

    this.server.listen(
      this.port,
      this.host,
      () => {
        console.log(`${colors.cyan('[Status]')} App is running on ${colors.yellow(`http://${this.host}:${this.port}`)}`);
      });

    this.started = true;
  }

  addIdToComponent(component) {
    this.idIncrement += 1;
    component.$$id = this.idIncrement;
  }

  add$$matchToComponent(component) {
    if (component.path.includes(':')) {
      const matcher = match(component.path, { decode: decodeURIComponent });

      component.$$match = (url) => {
        return component.$$route = matcher(url);;
      };

      return;
    }

    component.$$match = (url) => {
      return component.$$route = url === component.path;
    };
  }

  registerComponent(component) {
    this.addIdToComponent(component);
    this.add$$matchToComponent(component);

    this.components.push(component);

    return this;
  }

  addMiddleware(middleware) {
    if (!this.server) {
      return this;
    }

    this.server.use(middleware);

    return this;
  }

  registerComponents(...components) {
    components.forEach(this.registerComponent.bind(this));
    return this;
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

  method(rawMethod, path, callback) {
    const method = typeof rawMethod?.toLowerCase === 'function'
      ? rawMethod.toLowerCase()
      : null;

    if (!(typeof method === 'string' && httpMethods.includes(method))) {
      console.error('this method does not exist'); // TODO
      return this;
    }

    const component = {
      path,
      [method]: (typeof callback === 'function' && callback)
        || (typeof callback === 'undefined' && (({ res }) => {
          res.statusCode = 204;
          return '';
        }))
        || (() => callback),
    };

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

  // registerPlugin() {
  //
  // }
  //
  // registerPlugins() {
  //
  // }

  // registerCron() {
  //
  // }
  //
  // registerCrons() {
  //
  // }
  //
  // registerCronsDirectory() {
  //
  // }
  //
  // registerCronsDirectories() {
  //
  // }

  determinePath(...paths) {
    const partialPath = path.join(...paths);

    return path.isAbsolute(partialPath)
      ? partialPath
      : path.join(this.rootPath, partialPath);
  }
}

httpMethods.forEach((method) => {
  if (App[method]) {
    return;
  }

  App.prototype[method] = function(...args) {
    return this.method(method, ...args);
  };
});

module.exports = App;
