const Web3 = require('web3');
// TODO: CHANGE BASED ON ENV
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
// -----

module.exports = web3;
