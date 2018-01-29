const Store = artifacts.require('./Store');

contract('Store', async function(accounts) {
  let instance;
  before(async () => {
    instance = await Store.deployed();
  });

  contract('set', async function(accounts) {
    contract('reg path', async function(accounts) {
      let res1, res2;
      const ns = 'QyPvnQubnpC7kcx86FN9';
      const keys = ['foo1', 'foo2'];
      const vals = ['bar', '{some: "obj"}'];
      before(async () => {
        await instance.set(ns, keys[0], vals[0]);
        await instance.set(ns, keys[1], vals[1]);
        res1 = await instance.get.call(ns, keys[0]);
        res2 = await instance.get.call(ns, keys[1]);
      });

      it('should have right static address', async function() {
        web3.toUtf8(res1).should.eq(vals[0]);
        web3.toUtf8(res2).should.eq(vals[1]);
      });
    });

    contract('override path', async function(accounts) {
      let res1, res2;
      const ns = 'QyPvnQubnpC7kcx86FN9';
      const keys = ['foo1', 'foo2'];
      const vals = ['bar', '{some: "obj"}'];
      before(async () => {
        await instance.set(ns, keys[0], vals[0]);
        await instance.set(ns, keys[1], vals[1]);
        await instance.set(ns, keys[0], 'override');
        res1 = await instance.get.call(ns, keys[0]);
        res2 = await instance.get.call(ns, keys[1]);
      });

      it('should have right static address', async function() {
        web3.toUtf8(res1).should.eq('override');
        web3.toUtf8(res2).should.eq(vals[1]);
      });
    });

    contract('multi ns', async function(accounts) {
      let res1, res2, res3;
      const ns1 = 'QyPvnQubnpC7kcx86FN9';
      const ns2 = 'NsI7o0MldfvchewR5NDA';
      const keys = ['foo1', 'foo2', 'foo1'];
      const vals = ['bar', '{some: "obj"}', 'barbar'];
      before(async () => {
        await instance.set(ns1, keys[0], vals[0]);
        await instance.set(ns1, keys[1], vals[1]);
        await instance.set(ns2, keys[2], vals[2]);
        res1 = await instance.get.call(ns1, keys[0]);
        res2 = await instance.get.call(ns1, keys[1]);
        res3 = await instance.get.call(ns2, keys[2]);
      });

      it('should have right static address', async function() {
        web3.toUtf8(res1).should.eq(vals[0]);
        web3.toUtf8(res2).should.eq(vals[1]);
        web3.toUtf8(res3).should.eq(vals[2]);
      });
    });

    contract('empty', async function(accounts) {
      const ns = 'QyPvnQubnpC7kcx86FN9';
      let res;
      before(async () => {
        res = await instance.get.call(ns, 'some id');
      });

      it('should return empty string', async function() {
        res.should.eq('0x0000000000000000000000000000000000000000000000000000000000000000');
      });
    });
  });

  contract('setPermission', async function(accounts) {

      const ns = 'QyPvnQubnpC7kcx86FN9';
      const key = 'foo1';
      const val = 'bar';

      before(async () => {
          await instance.setPermission(ns, accounts[1]);
      });

      it ("Should work only if has permission", async () => {
          await instance.set(ns, key, val, {from: accounts[1]});

          try {
              await instance.set(ns, key, val, {from: accounts[2]})
          } catch (error) {
              assert.isTrue(error.message === "VM Exception while processing transaction: revert");
              console.log(error.message);
          }

      });

  });


});
