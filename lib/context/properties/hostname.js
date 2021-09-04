module.exports = (request) => {
  return request.headers.host || request.headers[':authority'];
};
