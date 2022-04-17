import { oneInch } from './1inch';
import { ethers } from 'ethers';
import config from '../config';
import { MONITORED_TOKENS } from './data';
import { Quote } from './types';
import { BigNumber } from 'bignumber.js';
import { flat } from './utils';
import { Token } from '@uniswap/sdk';
import { bot, sendMessage } from './utils/bot';
import { tradingBotCall } from './contracts';

const Main = async () => {
  console.log(`---`.repeat(10));
  console.log('Starting...');
  console.log(`---`.repeat(10));

  await oneInch
    .getProtocols()
    .then((protocols: string[]) => {
      console.log(
        `Finding the best route for trade on: ${protocols
          .map((protocol: any) => protocol?.title)
          .join(', ')}...👀👀👀`
      );
    })
    .catch((_err: any) => {});

  console.log(`---`.repeat(10));
  console.log('Connecting to telegram bot...\n---');
  await bot
    .launch()
    .then((_result) => {
      console.log('Connected to telegram bot!');

      sendMessage(
        `Bot starting at ${new Date()
          .toString()
          .replaceAll('(', '\\(')
          .replaceAll(')', '\\)')}...`
      );
    })
    .catch((error: any) => {
      console.log('Telegram error:', error);
    });

  console.log(`---`.repeat(10));

  const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC);
  let message = '';
  provider.on('block', (_blockNumber: number) => {
    console.log(`Block Number:`, _blockNumber, new Date());
    console.log('---'.repeat(5));

    if (_blockNumber % 4 != 0) {
      return;
    }

    MONITORED_TOKENS.forEach(async (token: Token) => {
      try {
        const buy_quote: Quote = await oneInch.getQuote({
          fromTokenAddress: config.WETH_ADDRESS,
          toTokenAddress: token.address,
          amount: new BigNumber(config.ETH_IN_AMOUNT).shiftedBy(18).toString(),
        });
        let token_amount = buy_quote.toAmount;
        const sell_quote: Quote = await oneInch.getQuote({
          fromTokenAddress: token.address,
          toTokenAddress: buy_quote.srcToken.address,
          amount: token_amount,
        });

        let eth_out = new BigNumber(sell_quote.toAmount);

        let token_out = parseFloat(
          new BigNumber(token_amount)
            .shiftedBy(-buy_quote.toToken.decimals!)
            .toFixed(6)
        );
        let best_buy_protocols = (await flat(buy_quote.protocols))
          .map((quote: any) => quote.name)
          .join(',');
        let best_sell_protocols = (await flat(sell_quote.protocols))
          .map((quote: any) => quote.name)
          .join(',');

        // calculate profitability
        let _gasPrice = new BigNumber(
          ethers.utils.formatUnits(await provider.getGasPrice(), 'ether')
        );

        let txFee = _gasPrice.multipliedBy(config.GAS_USED_ESTIMATE);

        let _profitInEth = eth_out.minus(
          new BigNumber(config.ETH_IN_AMOUNT).shiftedBy(18).toString()
        );

        let _profitInEthAfterGas = _profitInEth.minus(txFee);

        // @dev ensure that the best place to buy and sell are not the same
        // from observation if the above happens true that is if the best place to buy == best place to sell
        // trade is always unprofitable
        let is_not_same_router =
          JSON.stringify(best_buy_protocols) !=
          JSON.stringify(best_sell_protocols);

        if (is_not_same_router) {
          console.log(`---`.repeat(8));

          // check if trade is profitable
          let message = '';
          if (_profitInEthAfterGas.gt(0)) {
            console.log(`Best Buy Route: ${best_buy_protocols}`);
            console.log(`Best Sell Route: ${best_sell_protocols}`);
            console.log(`Eth In Amount: ${config.ETH_IN_AMOUNT} WETH`);
            console.log(
              `minTokensAfterSwap: ${token_out} ${buy_quote.toToken.symbol}`
            );
            console.log(
              `Eth out Amount: ${eth_out
                .shiftedBy(-sell_quote.toToken.decimals!)
                .toFixed(6)} WETH`
            );

            console.log(`Est Tx Fee: ${txFee.toString()} WETH`);
            console.log(
              `Profit in WETH: ${_profitInEth.shiftedBy(-18).toFixed(6)} WETH`
            );
            console.info(
              `Profit in WETH After Gas: ${_profitInEthAfterGas
                .shiftedBy(-18)
                .toFixed(6)} WETH`
            );

            message = `*NEW PROFITABLE TRADE NOTIFICATION*\n---`;
            message += `\nBest Buy Route: ${best_buy_protocols}`;
            message += `\nBest Sell Route: ${best_sell_protocols}`;
            message += `\nEth In Amount: \'${config.ETH_IN_AMOUNT} WETH\``;
            message += `\nminTokensAfterSwap: \`${token_out} ${buy_quote.toToken.symbol}\``;
            message += `\nEth out Amount: \`${eth_out
              .shiftedBy(-sell_quote.toToken.decimals!)
              .toFixed(6)} WETH\``;
            message += `\nEst Tx Fee: \`${txFee.toString()} WETH\``;
            message += `\nProfit in WETH: \`${_profitInEth
              .shiftedBy(-18)
              .toFixed(6)} WETH\``;
            message += `\nProfit in WETH After Gas: \`${_profitInEthAfterGas
              .shiftedBy(-18)
              .toFixed(6)} WETH\``;
            sendMessage(message);
            // TODO initiate trade

            let _oneInchCallBuyData = await oneInch.buildTx({
              fromTokenAddress: buy_quote.srcToken.address,
              toTokenAddress: buy_quote.toToken.address,
              amount: buy_quote.srcAmount,
            });
            let _oneInchCallSellData = await oneInch.buildTx({
              fromTokenAddress: sell_quote.srcToken.address,
              toTokenAddress: sell_quote.toToken.address,
              amount: sell_quote.srcAmount,
            });
            message = `Sending a  new trade call:\n---
             \nToken In: ${buy_quote.srcToken.name} [📌](${
              config.EXPLORER
            }/token/${buy_quote.srcToken.address})
             \nToken Out: ${buy_quote.toToken.name} [📌](${
              config.EXPLORER
            }/token/${buy_quote.toToken.address})
             \nToken In Amount: \`${new BigNumber(buy_quote.srcAmount)
               .shiftedBy(-buy_quote?.srcToken?.decimals! || -18)
               .toFixed(4)} WETH\`
             \nEst. Profitability: \`${_profitInEthAfterGas
               .shiftedBy(-buy_quote.srcToken.decimals! || -18)
               .toFixed(4)} WETH\``;

            sendMessage(message);
            await tradingBotCall(
              buy_quote.srcToken.address,
              buy_quote.toToken.address,
              buy_quote.srcAmount,
              _oneInchCallBuyData,
              _oneInchCallSellData
            );
          }
        }
      } catch (error: any) {
        error = error?.message ? error?.message : error;
        console.error(`Error:`, error);
        message = '*NEW TRADE FAILED NOTIFICATION*\n---';
        message += `\nToken In: \`WETH\``;
        message += `\nToken out: \`${token.name}\` [📌](${config.EXPLORER}/token/${token.address})`;
        message += `\nAmount In: \`${config.ETH_IN_AMOUNT} WETH\``;
        message += `\n---`;
        message += `\nReason: \`${error}\``;

        sendMessage(message);
      }
    });
  });
};

Main();
