export default (request) => (request.socket.encrypted ? 'https' : 'http');
