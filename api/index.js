const requestListener = require('../server');

module.exports = (req, res) => {
  return requestListener(req, res);
};
