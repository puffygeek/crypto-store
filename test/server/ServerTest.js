const request = require('request-promise-native');
const should = require('chai').should();
const expect = require('chai').expect;
const server = require('../../index');
const serverAdrs = 'http://localhost:3000';

describe('Server', async function(accounts) {
  let res;
  describe('ping', async function(accounts) {
    before(async () => {
      res = await request(serverAdrs);
    });

    it('should be ok', () => {
      res.should.eq('ok');
    });
  });


  after(function () {
    server.close();
  });
});
