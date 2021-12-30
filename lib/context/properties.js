const properties = Object.create(null);

properties.hostname = require('./properties/hostname');
properties.ip = require('./properties/ip');
properties.method = require('./properties/method');
properties.params = require('./properties/params');
properties.protocol = require('./properties/protocol');
properties.req = require('./properties/req');
properties.res = require('./properties/res');
properties.socket = require('./properties/socket');
properties.url = require('./properties/url');

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
