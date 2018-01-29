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

    contract('Set/Get with permission', async function (accounts) {
      let res1, res2, res1_owner;
      const ns = 'QyPvnQubnpC7kcx86FN9';
      const keys = ['foo1', 'foo2'];
      const vals = ['bar', 'bar2'];
      before(async () => {
        await instance.setPermission(ns, accounts[1]);
        await instance.set(ns, keys[0], vals[0], {from: accounts[1]});
        await instance.set(ns, keys[1], vals[1], {from: accounts[0]}); // the owner has always permissions
        res1 = await instance.get.call(ns, keys[0], {from:accounts[1]});
        res2 = await instance.get.call(ns, keys[1], {from:accounts[0]});
        res1_owner = await instance.get.call(ns, keys[0], {from:accounts[0]});
      });
      it('should have right static address', async function() {
        web3.toUtf8(res1).should.eq(vals[0]);
        web3.toUtf8(res2).should.eq(vals[1]);
        web3.toUtf8(res1_owner).should.eq(vals[0]);
      });
    });

    contract('Set w/o permission', async function (accounts) {
      const ns = 'QyPvnQubnpC7kcx86FN9';
      const key = 'foo1';
      const val = 'bar';
      before(async () => {
        await instance.setPermission(ns, accounts[1]);
      });

      it('should not have permission to call set', async function() {
        try {
          await instance.set(ns, key, val, {from: accounts[2]});
        } catch (error) {
          error.message.should.eq('VM Exception while processing transaction: revert');
        }
      });
    });

    contract('Get w/o permission', async function (accounts) {
      const ns = 'QyPvnQubnpC7kcx86FN9';
      const key = 'foo1';
      const val = 'bar';
      it('should not have permission to call set', async function() {
        before(async () => {
          await instance.setPermission(ns, accounts[1]);
          await instance.set(ns, key, val, {from: accounts[1]});
        });
        try {
          await instance.get(ns, key, {from: accounts[2]});
        } catch (error) {
          error.message.should.eq('VM Exception while processing transaction: revert');
        }
      });
    })
  });
});
