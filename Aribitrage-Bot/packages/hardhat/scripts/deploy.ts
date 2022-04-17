import { ethers } from 'hardhat';
import config from '../config';

const main = async () => {
  // We get the contract to deploy
  const TradingBot = await ethers.getContractFactory('TradingBot');
  const tradingbot = await TradingBot.deploy(
    config.LendingPoolAddressesProvider,
    config.ONEINCH_ROUTER
  );

  console.log('TradingBot deployed to:', tradingbot.address);
};

main()
  .then((result) => {
    process.exit(0);
  })
  .catch((_err) => {
    console.error(`Error:`, _err);
  });
