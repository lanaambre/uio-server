import { match } from 'path-to-regexp';
import forEach from 'lodash.foreach';

// Attributes Reader
import AttributesReader from './AttributesReader.mjs';
import allowedExtensions from '../vars/allowedAttributesExtensions.mjs';
import AsyncFunction from '../utils/AsyncFunction.mjs';
import httpMethods from '../vars/httpMethods.mjs';

class Component {
  id;

  app;

  context = true;

  rawconfig;

  methods;

  name;

  path;

  match;

  requestListeners = {};

  lifecycle = {
    before: [],
    method: [],
    after: [],
  };

  constructor({ app, rawConfig }) {
    this.app = app;
    this.rawConfig = rawConfig;

    this.setup();
  }

  setup() {
    this.setup$name();
    this.setup$path();
    this.setup$context();

    this.setup$methods();

    // this.setup$plugins();

    // this.check();
  }

  setup$id(id) {
    this.id = id;
  }

  setup$name() {
    this.name = this.rawConfig.name;
  }

  setup$context() {
    if (typeof this.rawConfig.context === 'boolean') {
      this.context = this.rawConfig.context;
    }
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
    const attributesReader = new AttributesReader({
      allowedAttributes: httpMethods,
      allowedExtensions,
      transformAttribute: (attribute) => attribute.toUpperCase(),
    });

    this.methods = attributesReader.process(this.rawConfig);
  }

  // setup$plugins() {}

  // check() {}

  build() {
    forEach(this.methods, (handler, httpMethod) => {
      this.addRequestListenerFor(httpMethod);
    });

    return this;
  }

  addRequestListenerFor(httpMethod) {
    const asyncFunctionBody = `
      ${
        (this.context &&
          'const context = getContext(preContext, req, res, app);') ||
        ''
      }

      try {
        const resData = await this.methods.${httpMethod}.call(
          undefined${(this.context && `, context.proxy`) || ''}
        );

        res.end(resData);
      } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.end('Internal server error');
      }

      ${(this.context && 'context.revoke();') || ''}
    `;

    const asyncFunction = new AsyncFunction(
      'res',
      'req',
      'preContext',
      'getContext',
      'app',
      asyncFunctionBody,
    ).bind(this);

    this.requestListeners[httpMethod] = asyncFunction;

    return this.requestListeners[httpMethod];
  }
}

export default Component;
