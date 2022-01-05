const colors = require('colors');
const glob = require('glob');
const http = require('http');
const path = require('path');

const httpMethods = require('./vars/httpMethods');

const getContext = require('./context');
const matchComponent = require('./router/matchComponent');

const Component = require('./component/Component');

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

    const requestListener = this.getRequestListener();

    this.server = http.createServer(requestListener);

    this.server.listen(
      this.port,
      this.host,
      () => {
        console.log(`${colors.cyan('[Status]')} App is running on ${colors.yellow(`http://${this.host}:${this.port}`)}`);
      });

    this.started = true;
  }

  getRequestListener() {
    return async (req, res) => {
      const url = req.url;

      const preContext = {
        state: {},
      };

      let route;

      for (const component of this.components) {
        preContext.route = component.match(url);

        if (preContext.route) {
          preContext.component = component;
          break;
        }
      }

      const method = preContext.component?.methods[req.method.toLowerCase()];

      if (method) {
        const context = getContext(preContext, req, res, this);

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
  }

  addIdToComponent(component) {
    this.idIncrement += 1;
    component.setup$id(this.idIncrement);
  }

  registerComponent(rawConfig = {}) {
    const component = new Component({
      app: this,
      rawConfig,
    });

    this.addIdToComponent(component);

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
