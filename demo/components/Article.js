module.exports = {
  name: 'Article',
  path: '/articles/:slug.html',

  get() {
    console.log(this);
    return 'I\'m an article';
  },

  post() {

  },
};
