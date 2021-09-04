module.exports = (request) => {
  return request.socket.encrypted ? 'https' : 'http';
};
