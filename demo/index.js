require('dotenv').config();

const App = require('../lib/App');

new App({
  host: process.env.HOST,
  port: process.env.PORT,
})
  // .get('/alive')
  // .get('/404', 404)
  // .get('/500', 500)
  // .registerComponent(Home)
  // .registerComponent(Article)
  .registerDirectory('components')
  .get('/alive')
  .start();
