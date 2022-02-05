const properties = require('./properties.js');

module.exports = (preContext, req, res, app) =>
  Proxy.revocable(preContext, {
    get(target, propertyKey) {
      if (properties[propertyKey]) {
        return properties[propertyKey](req, res, target, app);
      }

      return undefined;
    },
  });
