import * as properties from './properties.mjs';

export default (preContext, req, res, app) =>
  Proxy.revocable(preContext, {
    get(target, propertyKey) {
      if (properties[propertyKey]) {
        return properties[propertyKey](req, res, target, app);
      }

      return undefined;
    },
  });
