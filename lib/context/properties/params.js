module.exports = (req, res, match) => {
  return match?.route?.params ?? {};
};
