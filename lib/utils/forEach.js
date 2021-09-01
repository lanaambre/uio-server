function forEach(
  collection,
  callback,
  scope,
) {
  Object.keys(collection).forEach((key) => {
    const value = collection[key];
    callback.call(scope, value, key, collection);
  });
}

module.exports = forEach;
