const App = require('../lib/App');

const Home = require('./components/Home');

new App()
  // .get('/alive')
  // .get('/404', 404)
  // .get('/500', 500)
  .registerComponent(Home)
  .start();
