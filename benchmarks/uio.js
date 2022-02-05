import App from '../lib/App.mjs';

const app = new App({
  port: 3000,
});

app
  .registerComponent({
    path: '/',
    get() {
      return JSON.stringify({
        hello: 'world',
      });
    },
  })
  .start();
