# uio (Documentation française)

## Sommaire

## Installation

```
npm install ...
```


## Démarrage

`index.js`

``` javascript

const App = require('uio');

const app = new App();

app
  .get('/', 'Hello World')
  .start();


```

```
npm run dev
```

Démarre le serveur sur `localhost:7890`
