export default ({
  on,
  toComponent,
  // toApp,
  use,
}) => {
  // toApp.add('registerDirectory', () => {
  //
  // });

  toComponent.add('body');
  toComponent.add('params');
  toComponent.add('query');

  on('component.registration', (component) => {});

  use(({ plugins, req }) => {
    const { validator } = plugins;

    if (validator.check) {
      try {
        return validator.check(req);
      } catch (e) {
        // handle e;
      }
    }
  });
};
