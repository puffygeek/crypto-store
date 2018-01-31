const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const storeSol = require('../build/contracts/Store.json');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
const StoreContract = TruffleContract(storeSol);
StoreContract.setProvider(web3.currentProvider);
const set = async (ns, key, value, callerAdrs) => {
  if (!ns || !key || !value) return null;
  const storeContract = await StoreContract.deployed();
  const from = callerAdrs || await getFirstAccount();
  const tx = await storeContract.set(ns, key, value, { from });
  return tx;
}

const get = async (ns, key, callerAdrs) => {
  if (!ns || !key) return null;
  const storeContract = await StoreContract.deployed();
  const from = callerAdrs || await getFirstAccount();
  const resHex = await storeContract.get.call(ns, key, { from });
  const ipfsAdrs = web3.toUtf8(resHex);
  return ipfsAdrs;
}

function getFirstAccount() {
  return new Promise(resolve => {
    web3.eth.getAccounts((err, res) => resolve(res[0]));
  });
}

module.exports = { set, get }
