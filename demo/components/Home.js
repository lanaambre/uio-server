module.exports = {
  name: 'Home',
  path: '/',

  get({
    ip
  }) {
    return `Your ip is ${ip}`;
  },
};
