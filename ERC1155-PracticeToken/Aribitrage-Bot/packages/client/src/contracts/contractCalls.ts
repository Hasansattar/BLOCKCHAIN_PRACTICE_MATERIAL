import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import config from '../../config';

const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC);

const signer = new ethers.Wallet(config.PRIVATE_KEY, provider);
export const tradingBotCall = async (
  fromToken: string,
  toToken: string,
  fromAmount: string,
  _oneInchCallBuyData: string,
  _oneInchCallSellData: string
) => {
  let iface = new ethers.utils.Interface(
    JSON.parse(
      readFileSync(resolve(`${__dirname}/../abis/tradingbot.json`), 'utf-8')
    )
  );
  let tradingBot = new ethers.Contract(config.TRADING_BOT, iface, signer);

  try {
    // 0 = no debt(flash), 1 = stable, 2 = variable
    let modes = 0;

    // map from token | to token to weth address
    let params = ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'bytes', 'bytes'],
      [
        fromToken,
        toToken,
        fromAmount.toString(),
        _oneInchCallBuyData,
        _oneInchCallSellData,
      ]
    );
    const data = await tradingBot.swap(
      [fromToken],
      [fromAmount],
      [modes],
      params,
      {
        gasLimit: config.GAS_LIMIT,
        // nonce,
        // gasPrice: (
        //   await getFastGas()
        // )
        //   .shiftedBy(9)
        //   .minus(nonce ? nonce : '1')
        //   .toString(),
      }
    );
    console.log(`Tx data:`, data);
  } catch (err: any) {
    err = JSON.parse(JSON.stringify(err));
    console.log('err:', err);
    err = JSON.parse(err?.error?.body);
    console.log('err:', err);

    throw new Error(err?.error?.message);
  }
};
