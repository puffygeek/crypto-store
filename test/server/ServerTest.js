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

  describe('set', async function(accounts) {
    describe('all good params', async function(accounts) {
      before(async () => {
        res = await request.post({
          url: serverAdrs + '/set',
          json: { key: 'foo', value: 'bar' },
        });
      });

      it('should return right hash', () => {
        res.should.eq('QmW3J3czdUzxRaaN31Gtu5T1U5br3t631b8AHdvxHdsHWg'); //hash of bar
      });
    });

    describe('bad params', async function(accounts) {
      describe('no key', async function(accounts) {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/set',
            json: { value: 'bar' },
          });
        });

        it('should return right hash', () => {
          res.should.have.key('error');
        });
      });

      describe('no value', async function(accounts) {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/set',
            json: { key: 'foo' },
          });
        });

        it('should return right hash', () => {
          res.should.have.key('error');
        });
      });
    });
  });

  after(async () => {
    await server.exit();
  });
});
