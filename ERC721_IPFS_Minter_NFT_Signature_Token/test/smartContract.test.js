const { assert } = require("chai"); //chai library for testin the smart contract

// eslint-disable-next-line no-undef
const SmartContract = artifacts.require("./SmartContract.sol"); // import the arifcat of smartcontract

require("chai").use(require("chai-as-promised")).should();

// eslint-disable-next-line no-undef
contract("SmartContract", (accounts) => {        //first create instance of contract
  let smartContract;

  // eslint-disable-next-line no-undef
  before(async () => {                              //before testing functionality ,check smart contract is being deployed
    smartContract = await SmartContract.deployed();  // now we have smartcontract instance
  });

  // eslint-disable-next-line jest/valid-describe
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await smartContract.address;
      assert.notEqual(address, "");
      assert.notEqual(address, 0x0);
    });
  });

  // eslint-disable-next-line jest/valid-describe
  describe("minting", async () => {
    it("minted successfully", async () => {
      const uri = "https://example.com";
      await smartContract.mint(accounts[0], uri);
      const tokenUri = await smartContract.tokenURI(0);
      const balanceOfOwner = await smartContract.balanceOf(accounts[0]);
      assert.equal(tokenUri, uri);
      assert.equal(balanceOfOwner, 1);
    });
  });
});
