import 'dotenv/config.js'; // eslint-disable-line

import App from '../lib/App.mjs';

const app = new App({
  host: process.env.HOST,
  port: process.env.PORT,
});

await app.registerDirectory('components');

app.start();
