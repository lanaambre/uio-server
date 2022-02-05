export default {
  name: 'User',
  path: '/user/:id',

  get({ params, $db }) {
    return $db.user.getById(params.id);
  },

  post({ body, $db }) {
    return $db.user.create(body);
  },

  delete({ params, $db }) {
    return $db.user.deleteById(params.id);
  },

  body: {
    username: {
      type: String,
      minLength: 3,
      maxLength: 40,
    },
    password: {
      type: String,
      minLength: 8,
    },
    email: {
      type: String,
      format: 'email',
    },
  },
  bodyOptions: {
    removeUnwantedAttributes: true,
  },
};
