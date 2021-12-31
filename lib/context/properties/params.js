module.exports = (req, res, target) => {
  return target?.route?.params ?? {};
};
