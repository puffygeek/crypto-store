const request = require('request-promise-native');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const Server = require('../../server');
const should = chai.should();
chai.use(sinonChai);

describe('Middleware', async function() {
  const port = 3001;
  let server, res;
  const middleware = sinon.spy((req, res, next) => {
    next();
  });
  server = new Server({ middleware });

  before(async () => {
    await server.start({ port });
    res = await request(`http://localhost:${port}`);
  });

  it('should be ok', () => {
    res.should.eq('ok');
  });

  it('should call middleware', () => {
    middleware.should.have.been.calledOnce;
  });


  afterEach(async () => {
    await server.exit();
  });
});
