module.exports = {
  name: 'Article',
  path: '/articles/:slug-a:id.html',

  get({
    params,
  }) {
    return `Slug : ${params.slug}\nId : ${params.id}`;
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
