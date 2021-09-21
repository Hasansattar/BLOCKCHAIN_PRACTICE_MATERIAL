import store from "../store";                                   //3

const fetchDataRequest=()=>{                                   //1
    return{
        type: "CHECK_DATA_REQUEST"
    }
};


const fetchDataSuccess=(data)=>{                            //1
    return{
        type: "CHECK_DATA_SUCCESS",
        payload:data,
    }
};


const fetchDataFailed=(data)=>{                          //1
    return{
        type: "CHECK_DATA_FAILED",
        payload:data,
    }
};



export const fetchData=(account)=>{                                 //2
    return async(dispatch)=>{
        dispatch(fetchDataRequest());                                //4
        try {
            let name =await store.getState().blockchain.smartContract.methods.name().call();              //5
            let allTokens =await store.getState().blockchain.smartContract.methods.getAllTokens().call();
              console.log("ALL TOKENS in ACTION", allTokens); 
            dispatch(fetchDataSuccess({
                  name,
                  allTokens
              })) 
            
        } catch (error) {
            console.log("err",error)
            dispatch(fetchDataFailed("cloud not load the data"))
        }

    }
}