export default (request) =>
  request.headers.host || request.headers[':authority'];
