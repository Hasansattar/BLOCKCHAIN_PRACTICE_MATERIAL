const SmartContract = artifacts.require("LunaLanders");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "PIAIC TEST ROBOT", "PTR", "https://rr8ak8yxxqbe.grandmoralis.com/");
};
