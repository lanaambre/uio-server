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

``` bash
npm run dev
```

Démarre le serveur sur `localhost:7890`

## Composants

### Déclaration d'un composant

### Enregistrer un composant

``` javascript

const App = require('uio');

const app = new App();

const Users = {
  path: '/users/',
  get() {
    // get users
  },
  post() {
    // create an user
  }
}

app
  .registerComponent(Users)
  .start();

```

### Enregistrer un dossier de composant

``` javascript

const App = require('uio');

const app = new App();

app
  .registerDirectory('components')
  .start();

```
