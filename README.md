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

| Attributs           | Descriptions | Types                | Requis | Valeur par défaut |
|---------------------|--------------|----------------------|--------|-------------------|
| name                |              | String               |        | undefined         |
| path                |              | String               | x      |                   |
| get\|post\|put\|... |              | Function => Anything |        | undefined         |
| params              |              | UioValidatorSchema   |        | undefined         |
| query               |              | UioValidatorSchema   |        | undefined         |
| body                |              | UioValidatorSchema   |        | undefined         |
| headers             |              | PlainObject          |        | undefined         |

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

## Contexte

Le contexte est fourni aux méthodes HTTP de vos fonctions :

`/components/Example.js`

``` javascript

const Example = {
  name: 'Example',
  path: '/example',
  get(context) {
    console.log(context);
    // do your stuff
  },
};

```

`/components/User.js`

``` javascript

const User = {
  name: 'User',
  path: '/user/:id',
  get({
    params,
  }) {
    return `My id is ${params.id}`/;
  },
};

```

**Contenu du contexte**

| headers  |   |   |
|----------|---|---|
| hostname |   |   |
| ip       |   |   |
| method   |   |   |
| params   |   |   |
| protocol |   |   |
| query    |   |   |
| req      |   |   |
| res      |   |   |
| socket   |   |   |
| url      |   |   |


## Schéma

TODO
