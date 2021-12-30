const App = require('../lib/App');

const app = new App({
  port: 3000,
});

app.get('/', () => JSON.stringify({
    hello: 'world',
})).start();
