
const hre = require("hardhat");

async function main() {
  const Crud = await hre.ethers.getContractFactory("Crud");
  const crud = await Crud.deploy();

  await crud.deployed();

  console.log("Crud deployed to:", crud.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
