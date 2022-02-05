import http from 'http';
import path from 'path';

import Component from './component/Component.mjs';
import getContext from './context/index.mjs';
import glob from './utils/glob.mjs';
import httpMethods from './vars/httpMethods.mjs';

class App {
  components = [];

  host;

  httpMethods = httpMethods;

  idIncrement = 0;

  port;

  rootPath = process.cwd();

  server;

  started = false;

  constructor(config) {
    this.host = config?.host ?? 'localhost';
    this.port = config?.port ?? 7890;
  }

  async start() {
    if (this.started) {
      console.warn('Server is already started');
      return;
    }

    this.components.forEach((component) => component.build());

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
    return (req, res) => {
      // Get path and http method from incoming http request
      const { url, method } = req;

      // Prepare the preContext
      const preContext = {
        state: {},
      };

      // Match component and route, then add them to the preContext
      preContext.component = this.components.find((component) => {
        preContext.route = component.match(url);

        return preContext.route;
      });

      // Get the custom request listener generated during the component build
      // (a custom request listener is generated for each http method
      // declared in a component)

      const requestListener = preContext.component?.requestListeners[method];

      // Execute the custom request listener if available
      if (requestListener) {
        requestListener(res, req, preContext, getContext, this);
        return;
      }

      // Otherwise do a 404 not found
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

  async registerDirectory(directoryPath, extension = '**/*+(.mjs|.js)') {
    const fullPath = this.determinePath(directoryPath, extension);

    let files = [];

    try {
      files = await glob(fullPath, {
        nodir: true,
      });
    } catch (e) {
      console.error('Fail to register directory', directoryPath, e);
      return this;
    }

    const promises = files.map((filePath) =>
      this.registerComponentByPath(filePath),
    );

    await Promise.all(promises);

    console.log(
      `[Status] Registered ${files.length} components from "${directoryPath}" directory`,
    );

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
