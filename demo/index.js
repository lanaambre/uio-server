const App = require('../lib/App');

const Home = require('./components/Home');
const Article = require('./components/Article');

new App()
  // .get('/alive')
  // .get('/404', 404)
  // .get('/500', 500)
  // .registerComponent(Home)
  // .registerComponent(Article)
  .registerDirectory('components')
  .start();
