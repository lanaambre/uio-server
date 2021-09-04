const properties = Object.create(null);

properties.ip = require('./properties/ip');
properties.method = require('./properties/method');
properties.url = require('./properties/url');
properties.socket = require('./properties/socket');
properties.req = require('./properties/req');
properties.params = require('./properties/params');

// const forEach = require('./../utils/forEach');
//
// properties.$log = (request, response, app) => {
//   const data = Object.create(null);
//
//   forEach(properties, (value, index) => {
//     if (index === '$log') {
//       return;
//     }
//
//     data[index] = value(request, response, app);
//   });
//
//   return data;
// };

module.exports = properties;
