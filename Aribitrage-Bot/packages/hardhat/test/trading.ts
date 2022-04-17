import { expect } from 'chai';
import { oneInch } from '../../client/src/1inch';
import { Quote } from '../../client/src/types';
import config from '../config';

import { run, ethers } from 'hardhat';
import hre from 'hardhat';

describe('TradingBot contract', () => {
  it('can execute trade', async function () {
    const impersonatedAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

    const provider = new ethers.providers.JsonRpcProvider(
      ethers.provider.connection.url || 'http://localhost:8545'
    );

    // // Impersonate as another address
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [impersonatedAddress],
    });
    const impersonatedSigner = await ethers.getSigner(impersonatedAddress);
    console.log(
      'ETH Balance: ',
      ethers.utils.formatEther(await impersonatedSigner.getBalance())
    );

    const TradingBot = await ethers.getContractFactory('TradingBot');
    const tradingBot = await TradingBot.connect(impersonatedSigner).deploy(
      config.LendingPoolAddressesProvider,
      config.ONEINCH_ROUTER
    );

    let fromToken = config.WETH_ADDRESS;
    let fromAmount = ethers.utils.parseEther('1');

    console.log('fromAmount:', fromAmount);

    let toToken = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'; // aave token

    const buy_quote: Quote = await oneInch.getQuote({
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount: fromAmount.toString(),
    });

    let token_amount = buy_quote.toAmount;
    const sell_quote: Quote = await oneInch.getQuote({
      fromTokenAddress: toToken,
      toTokenAddress: buy_quote.srcToken.address,
      amount: token_amount,
    });
    console.log('done getting quote info...');

    let _oneInchCallBuyData = await oneInch.buildTx({
      fromTokenAddress: buy_quote.srcToken.address,
      toTokenAddress: buy_quote.toToken.address,
      amount: buy_quote.srcAmount,
    });

    let _oneInchCallSellData = await oneInch.buildTx({
      fromTokenAddress: sell_quote.srcToken.address,
      toTokenAddress: sell_quote.toToken.address,
      amount: sell_quote.srcAmount,
      fromAddress: impersonatedAddress,
    });

    console.log('done getting swap info...');

    // Make contract call as an impersonated address
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
      console.log(
        'about to swap... params',
        [fromToken],
        [fromAmount],
        [modes],
        params
      );
      const data = await tradingBot
        .connect(impersonatedSigner)
        .oneInchSwap(fromToken, fromAmount, _oneInchCallBuyData, {
          value: fromAmount,
          gasLimit: '300000',
          gasPrice: `0x${(1000 * 10 ** 9).toString(16)}`,
        });
      console.log(`Tx data:`, data);

      expect(0, 'trade success').equal(0);
    } catch (err: any) {
      console.log('err:', err);
      expect(0, 'trade failed').equal(1);
    }
  });
});
