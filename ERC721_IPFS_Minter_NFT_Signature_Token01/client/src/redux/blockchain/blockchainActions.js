import Web3 from "web3";
import SmartContract from "../../contracts/SmartContract.json";
//action call
//action me he hum thunk defined krty hein or wahn he hum reducers k saath connections banaty hein


//there are action call
const connectRequest=()=>{
      return{
          type:"CONNECTION_REQUEST",
      }
};

const connectSuccess=(data)=>{
    console.log('action data from react component', data);
    return{
        type:"CONNECTION_SUCCESS",
        payload:data
    }
};
const connectFailed=(data)=>{
     //  console.log('action data from react component', data);
    return{
        type:"CONNECTION_FAILED",
        payload:data
    }
};
const updateAccountRequest=(data)=>{
     //  console.log('action data from react component', data);
    return{
        type:"UPDATE_ACCOUNT",
        payload:data
    }
};


//we will always api call and fetch daata in action ,
export const connect=()=>{
    return async (dispatch)=>{   //dispatch is needed for redux and this also making use for redux thunk to accept asynchronous call
      
        dispatch(connectRequest());
        if(window.ethereum){
            let web3= new Web3(window.ethereum);
            try {
                const accounts=await window.ethereum.request({
                 method:"eth_accounts",
                });
                console.log("accounts",accounts)
                const networkId= await window.ethereum.request({
                  method:"net_version",
                });
                console.log("networkId",networkId)
                const NetworkData= await SmartContract.networks[networkId];
                if(NetworkData){
                    const smartContractObj=new web3.eth.Contract(
                        SmartContract.abi,
                        NetworkData.address
                    );
                    dispatch(connectSuccess({
                        account:accounts[0],
                        smartContract:smartContractObj,
                        web3:web3
                    })
                    );
                         //Add listeners start
                         window.ethereum.on("accountsChanged",(accounts)=>{
                             dispatch(updateAccountRequest(accounts[0]));
                         });
                         window.ethereum.on("chainChanged",()=>{
                             window.location.reload();

                        });
                          //Add listeners end

                }
                else{
                     dispatch(connectFailed("change the network plz"))
                }

                
            } catch (error) {
                dispatch(connectFailed("somethin went wrong"));
            }

        }
        else{
              dispatch(connectFailed("please install metamask"));
        }
    }
   
}