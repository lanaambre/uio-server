module.exports = (req, components) => {

  for (const component of components) {
    const route = component.$$match(req.url);

    if (route) {
      return { component, route }
    }
  }

  return null;

};
