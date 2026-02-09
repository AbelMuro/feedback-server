const serverless = require('serverless-http');
const app = require('../src');

const handler = serverless(app);

module.exports.handler = handler;