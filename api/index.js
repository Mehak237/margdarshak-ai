// Margdarshak AI - Vercel Serverless Function Entry Point
const url = require('url');
const { handleApi } = require('../server');

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  return handleApi(req, res, parsedUrl);
};
