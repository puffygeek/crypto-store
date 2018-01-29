const Authorizable = artifacts.require('./Authorizable')

contract('Authorizable', async function (accounts) {
  let instance;
  before(async () => {
    instance = await Authorizable.deployed();
  })

  contract('setPermission', async function (accounts) {
    const ns = 'QyPvnQubnpC7kcx86FN9';

    it('Should work only if owner', async () => {
      await instance.setPermission(ns, accounts[1], {from: accounts[0]});
    });

    it('Shouldn\'t work only if is executed not by the owner', async () => {
      try {
        await instance.setPermission(ns, accounts[1], {from: accounts[1]});
      } catch (error) {
        error.message.should.eq('VM Exception while processing transaction: revert');
      }
    });
  });
});
