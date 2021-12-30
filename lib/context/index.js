const properties = require('./properties.js');

module.exports = (req, res, match, app) => {
  return Proxy.revocable({
    state: {},
  }, {
    get(target, propertyKey) {

      if (properties[propertyKey]) {
        return properties[propertyKey](req, res, match, app, target.state);
      }



      return undefined;

    },
  });

};
