/* eslint-disable no-undef */
const TOKEN = artifacts.require("./TOKEN");
const  crowdSale = artifacts.require("./crowdSale");

module.exports = async function (deployer) {
 await deployer.deploy(TOKEN);
  
 const token=await TOKEN.deployed();
 //token Price is 0.0001
// var tokenPrice=100000000000000;
 
 await deployer.deploy(crowdSale,token.address,"100000000000000");

 
};