const request = require('request-promise-native');
const should = require('chai').should();
const expect = require('chai').expect;
const ethereum = require('../../storage/ethereum.js');

describe('Ethereum', async function(accounts) {
  let res;
  console.log('accounts', accounts);

  describe('set', async function() {
    describe('all good params', async function() {
      before(async () => {
        res = await ethereum.set('sagivo', 'foo', 'bar');
      });

      it('should return right hash', () => {
        res.should.have.keys('tx', 'receipt', 'logs');
      });
    });

    describe('bad params', async function(accounts) {
      describe('different user', async function(accounts) {
        before(async () => {
          // res = ;
        });
        it('should return right hash', async () => {
          try {
            await ethereum.set('sagivo', 'foo', 'bar', '0x627306090abab3a6e1400e9345bc60c78a8bef52');
            throw('should not be here');
          } catch (err) {
            err.should.be.an.instanceof(Error)
          }
        });
      });

      describe('missing param', async function(accounts) {
        before(async () => {
          res = await ethereum.set('sagivo', 'foo');
        });
        it('should return right hash', async () => {
          expect(res).to.be.null;
        });
      });
    });
  });

  describe('get', async function() {
    describe('all good params', async function() {
      before(async () => {
        await ethereum.set('sagivo', 'foo', 'bar');
        res = await ethereum.get('sagivo', 'foo');
      });

      it('should return right hash', () => {
        res.should.eq('bar');
      });
    });

    describe('bad params', async function(accounts) {
      describe('different user', async function(accounts) {
        before(async () => {
          // res = ;
        });
        it('should return right hash', async () => {
          try {
            const o = await ethereum.get('sagivo', 'foo', '0x627306090abab3a6e1400e9345bc60c78a8bef59');
            console.log('???', o);
            throw('should not be here');
          } catch (err) {
            err.should.be.an.instanceof(Error)
          }
        });
      });

      describe('missing param', async function(accounts) {
        before(async () => {
          res = await ethereum.get('sagivo');
        });
        it('should return right hash', async () => {
          expect(res).to.be.null;
        });
      });
    });
  });

});
