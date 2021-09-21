const initialState={                    //3
    loading:false,
    account:null,
    smartContract:null,
    web3:null,
    errorMsg:"",

};

//REducer

const blockchainReducer=( state=initialState, action)=> {            //1
    switch(action.type) {       //2
                          
        case "CONNECTION_REQUEST" :             //4                  
           return  {
               ...initialState,
               loading:true

           };

           case "CONNECTION_SUCCESS":          //4
           console.log("data in reducer from action", action.payload);
               return{
                   ...state,
                   loading:false,
                   account: action.payload.account,
                   smartContract: action.payload.smartContract,
                   web3:action.payload.web3
                   

               };

           case "CONNECTION_FAILED":             //4
                   return{
                       ...initialState,
                       loading:false,
                       errorMsg:action.payload

                   };

            case "UPDATE_ACCOUNT":               //4
                   return{
                       ...state,
                       account:action.payload.account

                   };
        
    
        default:
           return state;
    }


};

export default blockchainReducer;