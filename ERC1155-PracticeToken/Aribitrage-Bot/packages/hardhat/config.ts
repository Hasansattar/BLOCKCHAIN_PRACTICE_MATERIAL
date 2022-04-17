require('dotenv').config();

const config = {
  /**
   * WALLET
   */
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  PUBLIC_KEY: process.env.PUBLIC_KEY!,

  /**
   * PROVIDER
   */
  JSON_RPC: process.env.JSON_RPC,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,

  /**
   * AAVE
   */
  LendingPoolAddressesProvider: '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8', // Aave LendingPoolAddressesProvider Mainnet

  /**
   * ONEINCH_ROUTER
   */
  // ONEINCH_ROUTER: '0x1111111254fb6c44bAC0beD2854e76F90643097d', // v4
  ONEINCH_ROUTER: '0x11111112542d85b3ef69ae05771c2dccff4faa26', // v3
  // ONEINCH_ROUTER: '0x111111125434b319222CdBf8C261674aDB56F3ae', //v2

  WETH_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

export default config;
