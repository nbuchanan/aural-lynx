'use strict'

let config = require('config');
let AuralLynxServer = require('./Server');

let server = new AuralLynxServer(config);
server.Start();