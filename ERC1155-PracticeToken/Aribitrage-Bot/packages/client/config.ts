require('dotenv').config();

if (
  !process.env.PRIVATE_KEY &&
  !process.env.PUBLIC_KEY &&
  !process.env.JSON_RPC
) {
  throw new Error(
    'PRIVATE_KEY, PUBLIC_KEY, JSON_RPC Must be in your .env file'
  );
}

const config = {
  /**
   *  One Inch Exchange
   */
  CHAIN_ID: 1,
  ONEINCH_BASE_URL: 'https://api.1inch.io/v4.0',
  // ONEINCH_BASE_URL: 'https://api.1inch.exchange/v3.0',

  /**
   * WALLET
   */
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  PUBLIC_KEY: process.env.PUBLIC_KEY!,

  /**
   * PROVIDER
   */
  JSON_RPC: process.env.JSON_RPC!,

  /**
   * EXPLORER
   */
  EXPLORER: 'https://etherscan.io',

  //
  ETH_IN_AMOUNT: 6,

  // GAS_USED_ESTIMATE
  GAS_USED_ESTIMATE: 9e5,
  /**
   * TELEGRAM
   */
  WHITELISTED_USERS: ['251669027'], // users that will receive tg notifications
  BOT_TOKEN: process.env.BOT_TOKEN!,

  /**
   * Trading bot
   */
  TRADING_BOT: '0x3A6F3A810090F09d5C0e112B24e094A59651AE71',
  GAS_LIMIT: 9e5,
  WETH_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  // WETH_ADDRESS: `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`, // WBNB
};
export default config;
