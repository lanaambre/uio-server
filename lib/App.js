const http = require('http');

// TODO Déplacer la gestion de l'hôte et du port ailleurs
const host = 'localhost';
const port = 7890;

const getDynamicRequest = require('./request');
// const getDynamicResponse = require('./response');

const matchComponent = require('./router/matchRoute');

class App {
  constructor() {
    this.idIncrement = 0;
    this.components = [];
  }

  start() {
    const requestListener = async (req, res) => {
      const matchedComponent = matchComponent(req, this.components);

      if (!matchedComponent) {
        res.end('404 not found'); // TODO: better way to handle 404
        return;
      }

      const responseData = await matchedComponent.get();

      res.end(responseData);
    };

    const server = http.createServer(requestListener);

    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  }

  addIdToComponent(component) {
    this.idIncrement += 1;
    component.$$id = this.idIncrement;

    return this;
  }

  registerComponent(component) {
    this.addIdToComponent(component);
    this.components.push(component);

    return this;
  }

  registerComponents() {

  }

  registerDirectory() {

  }

  registerPlugin() {

  }

  registerPlugins() {

  }

  registerCron() {

  }

  registerCrons() {

  }

  registerCronsDirectory() {

  }

  registerCronsDirectories() {

  }
}

module.exports = App;
