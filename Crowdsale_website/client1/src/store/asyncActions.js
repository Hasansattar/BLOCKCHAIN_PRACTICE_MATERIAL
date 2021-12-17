import { setTokenNetwork ,setupWeb3, setupContract, addEthereumAccounts,  web3LoadingError ,setName,setSymbol, setTotalSupply,setTokensold,setBalanceof,setTokenprice} from "./actions";
import Web3 from "web3";
import TokenAbi from '../contracts/TOKEN.json';
import CrowdsaleAbi from '../contracts/crowdSale.json';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";
 
export const loadBlockchain = async(dispatch) =>{
    try {
        console.log(`Web3 = ${Web3}`);
        console.log(`Web3.givenProvider = ${Web3.givenProvider}`);
     
  //    const provider = await detectEthereumProvider()  
  //   if (provider) {

  // console.log('Ethereum successfully detected!')
  // await provider.enable();
  //  const web3 = new Web3(provider);
  

      

       if(Web3.givenProvider) {
            const web3 = new Web3(Web3.givenProvider);
    
               await Web3.givenProvider.enable();
           
            dispatch(setupWeb3(web3));

            const accounts = await web3.eth.getAccounts();
            dispatch(addEthereumAccounts(accounts[0]));

            const networkId = await web3.eth.net.getId();
            console.log("networkid",networkId)
            dispatch(setTokenNetwork(networkId))

            const deployedNetwork = TokenAbi.networks[networkId];
            console.log("deployedNetwork",deployedNetwork)
         

            const contract = new web3.eth.Contract(
                TokenAbi.abi,
                deployedNetwork && deployedNetwork.address,
            );    
            console.log("contract",contract)    
            console.log("contract.methods",contract.methods)         
            // dispatch(setupContract(contract));


            const nameoftoken = await contract.methods.name().call();
            console.log(nameoftoken);
            dispatch(setName(nameoftoken))

             // decimal
      const decimaloftoken = await contract.methods.decimals().call();
      console.log(decimaloftoken);


      // symbol
      const symboloftoken = await contract.methods.symbol().call();
      console.log(symboloftoken);
      dispatch(setSymbol(symboloftoken))

      // totalsupply
      const totalsupplyoftoken = await contract.methods
        .totalSupply()
        .call();
      const totalsupplyoftokenindecimals = await web3.utils.fromWei(
        totalsupplyoftoken,
        "ether"
      );
      console.log(totalsupplyoftokenindecimals);
      dispatch(setTotalSupply(totalsupplyoftokenindecimals))

      // const balanceofuser = await contract.methods
      //   .balanceOf(accounts[0])
      //   .call();
      // const balanceofuserinwei = await web3.utils.fromWei(
      //   balanceofuser,
      //   "ether"
      // );
      // console.log(balanceofuserinwei);
      // dispatch(setBalanceof(balanceofuserinwei))
        
// ------------------------------------------------------------------------------
            const deployedNetwork1 = CrowdsaleAbi.networks[networkId];
            const contract1 = new web3.eth.Contract(
                CrowdsaleAbi.abi,
                deployedNetwork1 && deployedNetwork1.address,
            );   
            console.log("contract1",contract1)  
            console.log("contract1.methods",contract1.methods)          
            dispatch(setupContract(contract1));
//=====================================================

const balanceofuser = await contract1.methods
.balanceOf(accounts[0])
.call();
const balanceofuserinwei = await web3.utils.fromWei(
balanceofuser,
"ether"
);
console.log(balanceofuserinwei);
dispatch(setBalanceof(balanceofuserinwei))



//=====================================================

            const tokenPrice= await contract1.methods.tokenPrice().call();
            console.log("token-price",tokenPrice);
           const tokenPriceinwei = await web3.utils.fromWei(tokenPrice,"ether");
           console.log("token-price",tokenPriceinwei);
           dispatch(setTokenprice(tokenPriceinwei))


           const devtokeninpresale = await contract1.methods
        .tokenContract()
        .call();
      console.log(devtokeninpresale);

      const totalsoldofpresale = await contract1.methods
        .tokensSold()
        .call();
      const totalsoldofpresaleinether = await web3.utils.fromWei(
        totalsoldofpresale,
        "ether"
      );
      console.log(totalsoldofpresaleinether);
      dispatch(setTokensold(totalsoldofpresaleinether))

          await totaltokensold(contract1,dispatch,web3)
          


         
            
            
           
        }
        else {
            dispatch(web3LoadingError("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"))
        }
    }
    catch(error){
        console.log(`Error in loading Web3 = ${error}`);
        if(error.code===4001){
            
            dispatch(web3LoadingError(error.message));
        }
    }
}

export const onsendbuytransaction = async (contract,accounts,inputfield,dispatch) => {
    const web3 = new Web3(window.ethereum);

       await contract.methods
      .buyTokens()
      .send({ from: accounts, value: web3.utils.toWei(inputfield, "ether") });
  

  };
 

export const totaltokensold=async(contract1,dispatch,web3)=>{
    try {
        const totalsoldofpresale = await contract1.methods
        .tokensSold()
        .call();
      const totalsoldofpresaleinether = await web3.utils.fromWei(
        totalsoldofpresale,
        "ether"
      );
      console.log(totalsoldofpresaleinether);
      dispatch(setTokensold(totalsoldofpresaleinether))

        
    } catch (error) {
        console.log("error",error)
    }

}   


