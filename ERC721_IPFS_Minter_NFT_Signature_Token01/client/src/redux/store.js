import { createStore,combineReducers ,applyMiddleware, compose } from 'redux'; //1
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";    //7
import dataReducer from "./data/dataReducer";

const rootReducer= combineReducers({                                          //4
        blockchain: blockchainReducer,
         data: dataReducer,
});
 
const middleware=[thunk];                                       //5 
const composeEnhancers=compose(applyMiddleware(...middleware));  //5


const configureStore=()=>{                                       //3
        return createStore(rootReducer,composeEnhancers);        //6
}


const store=configureStore();                                   //2

export default store;                                           //4