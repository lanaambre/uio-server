const properties = require('./properties.js');

module.exports = (request, response, app) => {
  return Proxy.revocable({}, {
    get(target, propertyKey) {
      if (!properties[propertyKey]) {
        return undefined;
      }

      return properties[propertyKey](request, response, app);
    },
  });
};
