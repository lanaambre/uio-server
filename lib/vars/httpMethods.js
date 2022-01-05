const http = require('http');

const httpMethods = http.METHODS.map(method => method.toLowerCase());

module.exports = httpMethods;
