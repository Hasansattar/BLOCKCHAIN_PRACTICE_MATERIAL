import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as s from "./styles/globalStyles";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import SignatureCanvas from "react-signature-canvas";
import { create } from 'ipfs-http-client';

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
 

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
   console.log( "blockchain ",blockchain);
  const data = useSelector((state) => state.data);
  console.log("data ",data);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [NFTS, setNFTS] = useState([]);

  const elementRef = useRef();
  const ipfsBaseUrl="https://ipfs.infura.io/ipfs/";
  const name ="NFT NAME";
  const description="IPFS MINTED NFT YAHOOOOO"


  const mint=(uri)=>{
    blockchain.smartContract.methods.mint(blockchain.account,uri).send({
      from:blockchain.account
    }).once("error",(error)=>{
      console.log(error);
      setLoading(false);
      setStatus("error")

    }).then((receipt)=>{
      console.log(receipt);
      setLoading(false)
      setStatus("succesfull minted you NFT")

    })

  };


  const createMetaDataAndMint= async(_name,_des,_imgBuffer)=>{
    setLoading(true);
    setStatus("uploading the data into ipfs")
    try {
      const addedImage  =await ipfsClient.add(_imgBuffer);
      console.log(ipfsBaseUrl +   addedImage.path);

      const metaDataObj={
        name:_name,
        description: _des,
        image: ipfsBaseUrl +   addedImage.path
      }
      console.log(metaDataObj);

      const addedMetaData= await ipfsClient.add(JSON.stringify(metaDataObj));
      console.log(ipfsBaseUrl +addedMetaData.path);

      mint(ipfsBaseUrl +addedMetaData.path);
     

    } catch (error) {
       console.log("error", error)
       setLoading(false);
       setStatus("some thing error")
    }
       
  };


   const startMintingProcess=()=>{
    
     createMetaDataAndMint(name,description,getImageData());
   //  getImageData();
   

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
          <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
            <s.TextTitle style={{ textAlign: "center" }}>
                   Welcome mint your signature       {/* Name : {data.name} */}
            </s.TextTitle>
            <s.SpacerSmall />
            {loading ? (

            <s.TextDescription style={{ textAlign: "center" }}>
                   loading...    
            </s.TextDescription>
            ) : null }

            <s.SpacerLarge />


            <s.SpacerSmall />
            {status !=="" ? (

            <s.TextDescription style={{ textAlign: "center" }}>
                   {status}   
            </s.TextDescription>
            ) : null }

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
