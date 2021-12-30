const authMiddleware = require('middlewares/authMiddleware');

module.exports = {
  name: 'Draft',
  path: '/draft',

  middlewares: [
    authMiddleware
  ],

  // OR

  get() {

  },
  post() {

  },
  delete() {

  },
};
