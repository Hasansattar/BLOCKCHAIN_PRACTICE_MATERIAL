import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as s from "./styles/globalStyles";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import SignatureCanvas from "react-signature-canvas";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
   console.log( "blockchain ",blockchain);
  const data = useSelector((state) => state.data);
  console.log("data ",data);

  const elementRef = useRef();


   const startMintingProcess=()=>{
     getImageData();

   };

const getImageData=()=>{
  const canvasEl= elementRef.current;
  let dataUrl= canvasEl.toDataURL("image/png");
  console.log(dataUrl);
  const buffer= Buffer(dataUrl.split(",")[1],"base64");
  console.log(buffer);
  return buffer;
     
   };




  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.account, blockchain.smartContract, dispatch]);

  return (
    <>
      <s.Screen>
        {blockchain.account === "" || blockchain.smartContract === null ? (
          <s.Container flex={1} ai={"center"} jc={"center"}>
            <s.TextTitle>connect to the blockchain</s.TextTitle>
            <s.SpacerSmall />
            <StyledButton
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
              }}
            >
              connect
            </StyledButton>
            <s.SpacerSmall />
            {blockchain.errorMsg !== "" ? (
              <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
            ) : null}
          </s.Container>
        ) : (
          <s.Container fle={1} ai={"center"} style={{ padding: 24 }}>
            <s.TextTitle style={{ textAlign: "center" }}>
                   Welcome mint your signature       {/* Name : {data.name} */}
            </s.TextTitle>
            <s.SpacerLarge />
            <StyledButton
              onClick={(e) => {
                e.preventDefault();
                //console.log("button")
                startMintingProcess();
              
              }}
            >
             MINT
            </StyledButton>
            <s.SpacerLarge />
            <SignatureCanvas
              backgroundColor={"#3271bf"}
              penColor="white"
              canvasProps={{ width: 350, height: 350, className: "sigCanvas" }}
              ref={elementRef}
            />
          </s.Container>
        )}
      </s.Screen>
    </>
  );
}

export default App;
