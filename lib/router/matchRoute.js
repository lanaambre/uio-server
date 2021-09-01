module.exports = (req, components) => {
  for (const component of components) {
    if (req.url === component.path) {
      return component;
    }
  }

  return null;
};
