const request = require('request-promise-native');
const should = require('chai').should();
const expect = require('chai').expect;
const server = require('../../index');
const serverAdrs = 'http://localhost:3000';

describe('Server', async function() {
  let res;
  describe('ping', async function() {
    before(async () => {
      res = await request(serverAdrs);
    });

    it('should be ok', () => {
      res.should.eq('ok');
    });
  });

  describe('set', async function() {
    describe('all good params', async function() {
      before(async () => {
        res = await request.post({
          url: serverAdrs + '/set',
          json: { key: 'foo', value: 'bar' },
        });
      });

      it('should return right object', () => {
        res.should.have.keys('ipfsHash', 'blockTx')
      });

      it('should return right hash', () => {
        res.ipfsHash.should.eq('QmW3J3czdUzxRaaN31Gtu5T1U5br3t631b8AHdvxHdsHWg'); //hash of bar
      });

      it('should return right tx', () => {
        res.blockTx.should.have.keys('tx', 'receipt', 'logs');
      });
    });

    describe('bad params', async function() {
      describe('no key', async function() {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/set',
            json: { value: 'bar' },
          });
        });

        it('should return error', () => {
          res.should.have.key('error');
        });
      });

      describe('no value', async function() {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/set',
            json: { key: 'foo' },
          });
        });

        it('should return error', () => {
          res.should.have.key('error');
        });
      });
    });
  });


  describe('get', async function() {
    describe('all good params', async function() {
      before(async () => {
        res = await request(serverAdrs + '/get/foo');
      });

      it('should return right hash', () => {
        res.should.eq('bar');
      });
    });

    describe('bad params', async function() {
      describe('no key', async function() {
        before(async () => {
          res = await request(serverAdrs + '/get/wrong');
        });

        it('should return right hash', () => {
          res.should.include('error');
        });
      });
    });
  });

  after(async () => {
    await server.exit();
  });
});
