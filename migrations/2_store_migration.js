var Store = artifacts.require("./Store");
var Authorizable = artifacts.require("./Authorizable");

module.exports = function(deployer) {
  deployer.deploy(Store);
  deployer.deploy(Authorizable);
};
