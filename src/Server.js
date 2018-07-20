'use strict'
const os = require('os');
const path = require('path');
const Util = require('util');

const myPackage = require('../package.json');

const _ = require('lodash');
const Promise = require('bluebird');
const logger = require('loglevel').noConflict().getLogger('AuralLynx');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const enableShutdown = require('http-shutdown');
const HttpStatus = require('http-status-codes');

let startupPromises = [];
let startupComplete = false;
let startTime = new Date();
let startUpMessage = 'Start up process (PID ' + process.pid + ') began at ' + startTime;

// Create application/json parser
let jsonParser = bodyParser.json();

function AuralLynxServer(config) {
  this.version = myPackage.version;
  this.server = initServer(config);
  logger.setLevel(config.logLevel);
}

AuralLynxServer.prototype.constructor = AuralLynxServer;

function initServer(opts) {
  let serv = express()
    .use(bodyParser.json({limit: '50mb'})) // parse application/json
    .use(bodyParser.urlencoded({limit: '50mb', extended: true})) // parse application/x-www-form-urlencoded
    .disable('x-powered-by')
    .use((req, res, next) => {
      // request parameters can come from query url or POST body
      req.query = _.extend(req.query || {}, req.body || {})
      next()
    })
    .set('view engine', 'ejs')
    .use(express.static(path.join(__dirname, '/public')))
    .use(cors());

  let server = serv.listen(process.env.PORT || opts.port, process.env.BIND || opts.bind, function() {
    let address = this.address().address;
    if (address.indexOf('::') === 0) {
      address = '[' + address + ']'; // literal IPv6 address
    }
    logger.info('Listening at http://%s:%d/', address, this.address().port);
  });

  // add server.shutdown() to gracefully stop serving
  enableShutdown(server);

  // TODO Move endpoint initialization to another location
  serv.get('/heartbeat', function(req, res, next) {
    if (startupComplete) {
      return res.status(HttpStatus.OK).send('OK');
    } else {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).send(startUpMessage);
    }
  });

  serv.get('/query', function(req, res, next) {

  });

  serv.post('/add', jsonParser, function(req, res, next) {

  });

  return serv;
}

AuralLynxServer.prototype.Initialize = function() {
  return new Promise((resolve, reject) => {
    logger.info('Initializing server...');

    // TODO Add initialization logic

    resolve();
  });
}

AuralLynxServer.prototype.Start = function() {

  startupPromises.push(this.Initialize());

  Promise.all(startupPromises).then(function() {
    logger.info('Startup complete' + os.EOL);
    startupComplete = true;
  }).
  catch(function(err) {
    logger.error('Error initializing server: ' + err);
    process.exit(1);
  });
}

AuralLynxServer.prototype.Stop = function() {
  this.server.close();
}

module.exports = AuralLynxServer;