const fs = require('fs');
const streamEqual = require('stream-equal');
const request = require('request-promise-native');
const should = require('chai').should();
const expect = require('chai').expect;
const serverAdrs = 'http://localhost:3000';
const Server = require('../../server');
const server = new Server();

describe('Server', async function() {
  let res;
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
  });

  describe.only('put', async function() {
    describe('all good params', async function() {
      before(async () => {
        res = await request.post({
          url: serverAdrs + '/put',
          formData: {
            file: fs.createReadStream(__dirname + '/cat.jpg'),
            key: 'cat',
          },
          json: true,
        });
      });

      it('should return right object', () => {
        res.should.have.keys('ipfsHash', 'blockTx')
      });

      it('should return right hash', () => {
        res.ipfsHash.should.eq('QmVY6Pgbz82ccYE72zBPJtSebxvVRz7nEcxWqMRdBm6sWD'); //hash of cat img
      });

      it('should return right tx', () => {
        res.blockTx.should.have.keys('tx', 'receipt', 'logs');
        res.blockTx.receipt.status.should.eq(1);
      });
    });

    describe('bad params', async function() {
      describe('no file', async function() {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/put',
            formData: { key: 'cat' },
            json: true,
          });
        });

        it('should return an error', () => {
          res.should.have.key('error')
        });
      });

      describe('no key', async function() {
        before(async () => {
          res = await request.post({
            url: serverAdrs + '/put',
            formData: {
              file: fs.createReadStream(__dirname + '/cat.jpg'), //new Buffer('hello'),
            },
            json: true,
          });
        });

        it('should return an error', () => {
          res.should.have.key('error')
        });
      });
    });
  });

  describe('pull', async function() {
    describe('all good params', async function() {
      describe('pull file', async function() {
        const file = fs.createReadStream(__dirname + '/cat.jpg');

        before(async () => {
          res = request(serverAdrs + '/pull/cat');
          // await res.pipe(fs.createWriteStream(__dirname + '/cat2.jpg'))
        });

        it('should return right hash', async () => {
          (await streamEqual(res, file)).should.be.true;
        });
      });
    });

    describe('bad params', async function() {
      describe('no key', async function() {
        before(async () => {
          res = await request(serverAdrs + '/pull/wrong');
        });

        it('should return right hash', () => {
          res.should.include('error');
        });
      });
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
        res.blockTx.receipt.status.should.eq(1);
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
      describe('get string', async function() {
        before(async () => {
          res = await request(serverAdrs + '/get/foo');
        });

        it('should return right hash', () => {
          res.should.eq('bar');
        });
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
