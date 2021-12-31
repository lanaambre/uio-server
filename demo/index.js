require('dotenv').config();

const App = require('../lib/App');

const Home = require('./components/Home.js');
const Article = require('./components/Article.js');

new App({
  host: process.env.HOST,
  port: process.env.PORT,
})
  // .get('/alive')
  // .get('/404', 404)
  // .get('/500', 500)
  .registerComponents(Home, Article)
  // .registerComponent(Home)
  // .registerComponent(Article)
  // .registerDirectory('components')
  .get('/alive')
  .start();
