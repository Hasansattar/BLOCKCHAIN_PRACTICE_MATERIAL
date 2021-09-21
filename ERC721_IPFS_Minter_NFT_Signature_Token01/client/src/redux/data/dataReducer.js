const initialState={
    loading:false,                                             //1
    name:"",                            
    allTokens:[],
    error:false,
    errorMsg:"",
}

const dataReducer = (state=initialState ,action)=>{               //2
    switch (action.type) {
        case "CHECK_DATA_REQUEST":                               //3
            return{
               ...initialState,
               loading:true
            };

         case "CHECK_DATA_SUCCESS":                               //3
         return{
             ...state,
             loading:false,
             name:action.payload.name,
             allTokens: action.payload.allTokens,
                };

        case "CHECK_DATA_FAILED":                                //3
          return{
                ...initialState,
                loading:false,
                error:true,
                errorMsg:action.payload
                    };
            
           
    
        default:
           return state;
    }
}


export default dataReducer;