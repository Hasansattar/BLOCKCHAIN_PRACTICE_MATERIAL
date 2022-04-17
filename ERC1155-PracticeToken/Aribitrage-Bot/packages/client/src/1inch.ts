import axios from 'axios';
import config from './../config';
import { Quote } from './types';

class OneInch {
  /**
   * Gets the best exchange rate for a given pair
   * @param fromTokenAddress - from token
   * @param toTokenAddress - to token
   * @param amount - from token amount
   * @param side - trade direction i.e buy or sell
   * @returns best quote found
   */
  getQuote = async (params: {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: number | string;
    side?: string;
  }): Promise<Quote> => {
    const { fromTokenAddress, toTokenAddress, amount, side } = params;
    try {
      const { data }: any = await axios({
        method: 'GET',
        url: `${config.ONEINCH_BASE_URL}/${config.CHAIN_ID}/quote`,
        params: {
          fromTokenAddress,
          toTokenAddress,
          amount,
        },
      });
      return {
        srcToken: data.fromToken,
        srcAmount: data.fromTokenAmount,
        toToken: data.toToken,
        toAmount: data.toTokenAmount,
        protocols: data.protocols,
      };
    } catch (error: any) {
      error = error?.response?.data;

      throw new Error(
        error?.description || `${error?.statusCode} ${error?.error}`
      );
    }
  };
  /**
   * Builds a tx based on the given params
   * @param fromTokenAddress - from Token
   * @param toTokenAddress - to Token
   * @param amount - from Token amount
   * @param slippage - slippage tolerance
   * @param gasLimit - gasLimit
   * @returns tx data that can be send to the network
   */
  buildTx = async (params: {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: number | string;
    slippage?: number;
    gasLimit?: string;
    fromAddress?: string;
  }) => {
    const {
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage,
      gasLimit,
      fromAddress,
    } = params;
    try {
      let defaultSlippage = 0.5;

      const { data }: any = await axios({
        method: 'GET',
        url: `${config.ONEINCH_BASE_URL}/${config.CHAIN_ID}/swap`,
        params: {
          fromTokenAddress,
          toTokenAddress,
          amount,
          fromAddress: fromAddress ? fromAddress : config.PUBLIC_KEY,
          disableEstimate:
            fromTokenAddress == config.WETH_ADDRESS ? false : true,
          slippage: slippage ? slippage : defaultSlippage,
        },
      });
      delete data.tx.gasPrice; //ethersjs will find the gasPrice needed
      delete data.tx.gas;

      return data.tx?.data;
    } catch (error: any) {
      throw new Error(JSON.stringify(error));
    }
  };

  /**
   * Gets supported protocols by 1inch price aggregator
   * @returns Supported protocols by 1inch price aggregator
   */
  getProtocols = async (): Promise<string[]> => {
    try {
      const { data }: any = await axios({
        method: 'GET',
        url: `${config.ONEINCH_BASE_URL}/${config.CHAIN_ID}/liquidity-sources`,
      });
      return data.protocols;
    } catch (error) {
      console.log(error);

      throw new Error(JSON.stringify(error));
    }
  };
}

export const oneInch = new OneInch();
