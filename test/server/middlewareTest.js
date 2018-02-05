const request = require('request-promise-native');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const serverAdrs = 'http://localhost:3000';
const Server = require('../../server');
const should = chai.should();
chai.use(sinonChai);

describe('Middleware', async function() {
  const middleware = sinon.spy((req, res, next) => {
    next();
  });
  const server = new Server({ middleware });

  before(async () => {
    server.start();
  });

  describe('ping', async function() {
    before(async () => {
      res = await request(serverAdrs);
    });

    it('should be ok', () => {
      res.should.eq('ok');
    });

    it('should call middleware', () => {
      middleware.should.have.been.calledOnce;
    });
  });

  after(async () => {
    await server.exit();
  });
});
