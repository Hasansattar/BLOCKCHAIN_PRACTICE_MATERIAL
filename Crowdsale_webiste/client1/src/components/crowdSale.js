import React, { useEffect, useState } from "react";
import { useStore } from "../context/GlobalState";
import CountUp from "react-countup";
import Loader from "react-loader-spinner";
import { onsendbuytransaction } from "../store/asyncActions";
import { loadBlockchain } from "../store/asyncActions";
import { totaltokensold } from "../store/asyncActions";
import Particles from "./Practical";
 

export const CrowdSale = () => {
  const [
    {
      contract,
      web3,
      accounts,
      name,
      symbol,
      totalSupply,
      tokenSold,
      balanceof,
      tokenPrice,
      networkID
    },
    dispatch,
  ] = useStore();
  // console.log("name",name)
  // console.log("symbol",symbol)
  // console.log("totalSupply",totalSupply)
  console.log("tokenSold", tokenSold);
  console.log("balanceof", balanceof);
  // console.log("tokenPrice",tokenPrice)
  console.log("accounts", accounts);
  console.log("contract", contract);
  console.log('networkid',networkID)
  //console.log("transactions=>",transactions)

  const [isTransactionInProcess, setTransactionInprocess] = useState(false);
  const [isTransactionSuccessful, setTransactionSuccessful] = useState(true);
  const [inputfield, setinputfield] = useState(0);



 

  const loadBlockchaindata = async () => {
    if(networkID !== 97){
      alert("PLEASE CONNECT BNB TEST NETWORK")


    }
     
  
      await loadBlockchain(dispatch);
    
    
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    setTransactionSuccessful(true);
    try {
      setTransactionInprocess(true);
      console.log(parseFloat(inputfield));
      if (parseFloat(inputfield) > 0) {
        await onsendbuytransaction(contract, accounts, inputfield, dispatch);

        setTransactionInprocess(false);
        setTransactionSuccessful(true);
        await totaltokensold(contract, dispatch, web3);
        await loadBlockchain(dispatch);
      } else {
        window.alert("null value not allowed");
        setTransactionInprocess(false);
      }
    } catch (error) {
      console.log("error", error);
      setTransactionInprocess(false);
      setTransactionSuccessful(false);
    }
  };

  return (
    <div className="header">
      {/* header  */}

      <Particles />
      <header>
        <div className="container mt-3  ">
          <div className="row">
            <div className="col-lg-8 text-white mt-3 ">
              <h5 className="float-lg-start">
            <span style={{ margin: '1rem', textAlign: 'right' , fontSize:"1rem" }}>   {accounts > 0 ? '🟢' :  ''}</span> 
                {" "}
                {accounts > 0
                  ? accounts.substr(0, 8) + "*******" + accounts.substr(8, 8)
                  : " "}
              </h5>
            </div>
            <div className="col-lg-4  col-sm-12 p-0  mt-sm-3">
              <button
                className="btn btn-primary btn-lg btn-sm-center float-lg-end"
                onClick={loadBlockchaindata}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* main..... */}
      <main>
        <div className="container  ">
          <div className="row">
            <div className="col  ">
              <div className="mt-3">
                <div className="container  ">
                  <div className="row">
                    <div className="col"></div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-lg-12  ">
                    <h1 className="text-center text-white  text-sm-center  ">
                      CROWD SALE Dgood
                    </h1>
                    <center>
                      {" "}
                      <hr className="bg-white w-50 " />
                    </center>

                    <br />
                  </div>

                  <div id="content" className="text-center text-white h5">
                    <p>
                      Introducing "{name}" {symbol}! &nbsp; Token price is{" "}
                      <span className="token-price"> {tokenPrice} BNB</span>.{" "}
                      <br />
                      You currently have {balanceof}{" "}
                      <span className="dapp-balance"></span>&nbsp;DGB.
                    </p>
                    <br />
                    <h3>
                      {isTransactionInProcess && (
                        <Loader
                          type="TailSpin"
                          color="#00BFFF"
                          height={30}
                          width={30}
                        />
                      )}{" "}
                    </h3>
                    {!isTransactionSuccessful && (
                      <div style={{ color: "red" }}>Transaction Error</div>
                    )}

                    <div className="container mb-4">
                      <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-7 col-md-12">
                          <div className="form-group">
                            <div className="input-group max-width-50%">
                              <input
                                id="numberOfTokens"
                                id="inputID"
                                className="form-control input-lg bg-transparent text-white max-width-40 col col-sm-12"
                                type="number"
                                name="number"
                                placeholder="ENTER BNB TO BUY TOKEN"
                                value={inputfield}
                                onChange={(e) => setinputfield(e.target.value)}
                                required
                              ></input>
                              &ensp;
                              <span className="input-group-btn">
                                {isTransactionInProcess ? (
                                  <div className="btn btn-primary btn-lg">
                                    Process.....
                                  </div>
                                ) : (
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    onClick={onsubmit}
                                    disabled={!inputfield}
                                  >
                                    Buy Tokens
                                  </button>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span> Total Supply: {totalSupply} GDB</span>

                    <br />
                    <center>
                      {" "}
                      <hr className="bg-white w-50 " />
                    </center>

                    <p>
                      <span className="tokens-sold"></span>{" "}
                      <CountUp start={0} end={tokenSold} duration={1} /> /{" "}
                      <span className="tokens-available"></span> tokens sold
                    </p>

                    <p id="accountAddress"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
