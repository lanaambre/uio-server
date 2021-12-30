module.exports = {
  name: '',
  path: '/example',

  get() {
    return 'I\'m an Uio component';
  },

  post({
    body,
    db,
  }) {
    return db.example.create(body);
  },

  methods: {

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
}
