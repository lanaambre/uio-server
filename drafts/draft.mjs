// Require Uio server
// const Server = require('@uio/server');
// const JSONHome = require('@uio/jsonhome-plugin');

import App from '../lib/App.mjs';

new App()
  .get('/', () => 'Hello World')
  .registerDirectory('components')
  .start();

/*

server

  // Attributes
  .config
  .setConfig
  .tree

  // Methods
  .registerComponent()
  .registerComponents()
  .registerDirectory()
  .registerDirectories()
  .registerCron()
  .registerCrons()
  .registerCronsDirectory()
  .registerCronsDirectories()
  .registerPlugin()
  .registerPlugins()
  .setup()
  .start()
  .on()
  .emit()

*/

/*
  EVENTS
  - registration
  - beforeStart
  - start
  - error
  - stop
  - pause
  - restart
*/

/*

  bodyParser: true,
  useReturnedValueAsBody: true,
*/
