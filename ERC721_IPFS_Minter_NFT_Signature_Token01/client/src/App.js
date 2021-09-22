import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import * as s from "./styles/globalStyles";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import SignatureCanvas from "react-signature-canvas";
import { create } from "ipfs-http-client";

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  console.log("blockchain ", blockchain);
  const data = useSelector((state) => state.data);
  console.log("data ", data);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [NFTS, setNFTS] = useState([]);
  const [nftname, setNftName] = useState("");
  const [nftdes, setNftdes] = useState("");

  const elementRef = useRef();

  const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
  const name = nftname;
  const description = nftdes;

  const mint = (uri) => {
    console.log("uri", uri);
    blockchain.smartContract.methods
      .mint(blockchain.account, uri)
      .send({
        from: blockchain.account,
      })
      .once("error", (error) => {
        console.log(error);
        setLoading(false);
        setStatus("error");
      })
      .then((receipt) => {
        console.log(receipt);
        setLoading(false);
        clearCanvas();
        setStatus("succesfull minted you NFT");
      });
  };

  const createMetaDataAndMint = async (_name, _des, _imgBuffer) => {
    setLoading(true);
    setStatus("uploading the data into ipfs");
    try {
      const addedImage = await ipfsClient.add(_imgBuffer);
      console.log(ipfsBaseUrl + addedImage.path);

      const metaDataObj = {
        name: _name,
        description: _des,
        image: ipfsBaseUrl + addedImage.path,
      };
      console.log(metaDataObj);

      const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
      console.log(ipfsBaseUrl + addedMetaData.path);

      mint(ipfsBaseUrl + addedMetaData.path);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      setStatus("some thing error");
    }
  };

  const startMintingProcess = () => {
    createMetaDataAndMint(name, description, getImageData());
    //  getImageData();
  };

  const getImageData = () => {
    const canvasEl = elementRef.current;
    let dataUrl = canvasEl.toDataURL("image/png");
    console.log(dataUrl);
    const buffer = Buffer(dataUrl.split(",")[1], "base64");
    console.log(buffer);
    return buffer;
  };

  const clearCanvas = () => {
    const canvasEl = elementRef.current;
    canvasEl.clear();
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.account, blockchain.smartContract, dispatch]);

  useEffect(() => {
    setNFTS([]);
    data.allTokens.forEach((nft) => {
      fetch(nft.uri)
        .then((response) => response.json())
        .then((metaData) => {
          setNFTS((prevState) => [
            ...prevState,
            {
              id: nft.id,
              metaData: metaData,
            },
          ]);
        })
        .catch((err) => {
          console.log("err", err);
        });
    });
  }, [data.allTokens]);

  console.log(NFTS);

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
              Welcome mint your signature {/* Name : {data.name} */}
            </s.TextTitle>
            <s.SpacerSmall />
            {loading ? (
              <s.TextDescription style={{ textAlign: "center" }}>
                loading...
              </s.TextDescription>
            ) : null}

            <s.SpacerSmall />
            {status !== "" ? (
              <s.TextDescription style={{ textAlign: "center" }}>
                {status}
              </s.TextDescription>
            ) : null}

            <s.SpacerLarge />

            <s.Container fd={"row"} jc={"center"}>
              <StyledButton
                onClick={(e) => {
                  e.preventDefault();
                  //console.log("button")
                  startMintingProcess();
                }}
              >
                MINT
              </StyledButton>
              <s.SpacerSmall />
              <StyledButton
                onClick={(e) => {
                  e.preventDefault();
                  clearCanvas();
                }}
              >
                clear
              </StyledButton>
            </s.Container>
            <s.SpacerSmall />

            <s.SpacerLarge />
            <s.Container fd={"row"} jc={"center"}>
              <input
                type="text"
                style={{
                  border: "2px solid #3271bf",
                  height: "40px",
                  marginTop: "10px",
                  backgroundColor: "transparent",
                  boxShadow: "0 0 6px #3271bf",
                  color: "white",
                }}
                placeholder="ENTER NFT NAME"
                size={35}
                onChange={(e) => setNftName(e.target.value)}
                required
              />
              <s.SpacerSmall />
              <textarea
                type="text"
                style={{
                  border: "2px solid #3271bf",
                  backgroundColor: "transparent",
                  boxShadow: "0 0 6px #3271bf",
                  color: "white",
                }}
                placeholder="ENTER NFT DESCRIPTION"
                rows="4"
                cols="35"
                onChange={(e) => setNftdes(e.target.value)}
                required
              />
            </s.Container>
            <s.SpacerSmall />
            <s.TextDescription>DRAW YOUR SIGNATURE HERE</s.TextDescription>
            <s.SpacerSmall />
            <SignatureCanvas
              backgroundColor={"#3271bf"}
              penColor="white"
              canvasProps={{ width: 350, height: 350, className: "sigCanvas" }}
              ref={elementRef}
            />

            <s.SpacerSmall />

            <s.SpacerLarge />
            <s.SpacerSmall />
            {data.loading ? (
              <s.TextDescription style={{ textAlign: "center" }}>
                loading...
              </s.TextDescription>
            ) : (
              <div style={{ width: "1000px", height: "100%" }}>
                {NFTS.map((nft, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        border: "2px solid #3271bf",
                        boxShadow: "0 0 6px #3271bf",
                        width: "250px",
                        height: "250px",
                        float: "left",
                        justifyContent: "space-between",
                      }}
                    >
                      <ul style={{ padding: "10px" }}>
                        <li>
                          <s.TextTitle> {nft.metaData.name} </s.TextTitle>
                        </li>
                        <s.SpacerSmall />
                        <img
                          alt={nft.metaData.name}
                          src={nft.metaData.image}
                          width={150}
                        />
                        <s.TextDescription>
                          {nft.metaData.description}
                        </s.TextDescription>
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </s.Container>
        )}
      </s.Screen>
    </>
  );
}

export default App;
