import '@nomiclabs/hardhat-waffle';
import config from './config';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/cfa06cd727dd478c9729465e63f9a760`,
      },
    },
    localhost: {
      url: `http://127.0.0.1:8545/`,
      accounts: [config.PRIVATE_KEY],
    },
    mainnet: {
      url: config.JSON_RPC,
      accounts: [config.PRIVATE_KEY],
    },
  },
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 50000,
  },
};
