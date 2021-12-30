module.exports = {
  name: 'Draft',
  path: '/draft',

  middlewares({ use, useFor, useExcept, load }) {
    const { authMiddleware, rateLimit } = load('authMiddleware', 'rateLimit');
    const { authMiddleware, rateLimit } = list;

    // The middleware(s) will be use for all HTTP method
    use(authMiddleware, rateLimit);

    // will be use for POST et DELETE only
    use('post', 'delete', authMiddleware, rateLimit);
    /* OR */
    useFor(['post', 'delete'], authMiddleware, rateLimit); // RECOMMANDED

    // will be use for every method except GET
    useExcept('get', authMiddleware, rateLimit);
  },

  get() {

  },
  post() {

  },
  delete() {

  },
};
