const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const should = chai.should;
const config = require('config');

chai.use(chaiHttp);

const Server = require('../src/Server');
const server = new Server(config);

describe('Server', () => {

  describe('Initialize', () => {
    it('should return a Promise', () => {
      const initializeResult = server.Initialize();
      expect(initializeResult.then).to.be.a('Function');
      expect(initializeResult.catch).to.be.a('Function');
    });
  });

  // describe('Endpoints', () => {
  //   it('should return OK on /heartbeat GET', (done) => {
  //     chai.request(server)
  //       .get('/heartbeat')
  //       .end(function(err, res) {
  //         res.should.have.status(200);
  //         done();
  //       });
  //   });
  // });

});