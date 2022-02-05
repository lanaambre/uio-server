import glob from 'glob';
import http from 'http';
import path from 'path';

import httpMethods from './vars/httpMethods.mjs';

import getContext from './context/index.mjs';

import Component from './component/Component.mjs';

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

    this.server.listen(this.port, this.host, () => {
      console.log(
        `[Status] App is running on http://${this.host}:${this.port}`,
      );
    });

    this.started = true;
  }

  getRequestListener() {
    return async (req, res) => {
      const { url } = req;

      const preContext = {
        state: {},
      };

      // match component
      preContext.component = this.components.find((component) => {
        preContext.route = component.match(url);

        return preContext.route;
      });

      const method = preContext.component?.methods[req.method.toLowerCase()];

      req.rawBodyChunks = [];

      req.on('data', (chunk) => {
        req.rawBodyChunks.push(chunk);
      });

      req.on('end', async () => {
        req.rawBody = Buffer.concat(req.rawBodyChunks);

        try {
          req.body = req.rawBody.toString();
          req.body = JSON.parse(req.body);
        } catch (e) {
          req.body = req.body || req.rawBody;
        }

        if (method) {
          const context = getContext(preContext, req, res, this);

          let resData;

          try {
            resData = await method.call(undefined, context.proxy);
            res.end(resData);
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end('Internal server error');
          }

          context.revoke();

          return;
        }

        res.statusCode = 404;
        res.end('404 not found'); // TODO: better way to handle 404
      });
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

  async registerComponentByPath(componentPath) {
    let component;

    try {
      const fullPath = this.determinePath(componentPath);
      const componentModule = await import(fullPath);
      component = componentModule.default;
    } catch (e) {
      console.error('Fail to get component by path', componentPath, e);
      return this;
    }

    return this.registerComponent(component);
  }

  method(rawMethod, currentPath, callback) {
    const method =
      typeof rawMethod?.toLowerCase === 'function'
        ? rawMethod.toLowerCase()
        : null;

    if (!(typeof method === 'string' && httpMethods.includes(method))) {
      console.error('this method does not exist'); // TODO
      return this;
    }

    const component = {
      path: currentPath,
      [method]:
        (typeof callback === 'function' && callback) ||
        (typeof callback === 'undefined' &&
          (({ res }) => {
            res.statusCode = 204;
            return '';
          })) ||
        (() => callback),
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

  App.prototype[method] = function (...args) {
    return this.method(method, ...args);
  };
});

export default App;
