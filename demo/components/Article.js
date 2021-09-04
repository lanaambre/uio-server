module.exports = {
  name: 'Article',
  path: '/articles/:slug.html',

  get({
    params,
  }) {
    return params.slug;
  },

  post() {

  },

  params: {
    slug: {

    },
  },

  query: {

  },

  body: {

  },
};
