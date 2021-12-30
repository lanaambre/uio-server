module.exports = {
  name: 'Home',
  path: '/',

  get() {
    const ip = this.ip;
    return `Your ip is ${ip}`;
  },
};
