module.exports = {
  name: 'Home',
  path: '/',

  get({
    ip
  }) {
    return `Your ip is ${ip}`;
  },

  'patch,put'() {
    return `You can combine different http method`;
  },

  'patch,put$options': {
    body: {
      removeUnwantedAttributes: true,

    },
  }
};
