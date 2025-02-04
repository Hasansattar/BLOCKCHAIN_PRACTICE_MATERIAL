const hre = require("hardhat");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );

  const MyToken = await hre.ethers.getContractFactory("ERC1155Practice");
  const myToken = await MyToken.deploy();

  console.log("deployed at:", myToken.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });