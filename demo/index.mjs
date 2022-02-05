import 'dotenv/config.js'; // eslint-disable-line

import App from '../lib/App.mjs';

import Home from './components/Home.mjs';
import Article from './components/Article.mjs';

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
