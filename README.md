# uio (Documentation française)

## Sommaire

## Installation

```
npm install ...
```


## Démarrage rapide (Hello World)

`index.js`

``` javascript

const App = require('uio');

const app = new App();

app
  .get('/', 'Hello World')
  .start();

// OU

app
  .get('/', () => 'Hello World')
  .start();

// OU

const Home = {
  path: '/',
  get() {
    return 'Hello World';
  }
};

app
  .registerComponent(Home)
  .start();

```

```
npm run dev
```

Démarre le serveur sur `localhost:7890`

## Composants

Si il est possible d'utiliser Uio à la façon
