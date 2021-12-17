// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch(action.type) {
      case 'SETUP_WEB3':
        return {
          ...state,
          web3: action.payload,
          web3LoadingErrorMessage: "",
          web3Loadded: true
        }
      case 'SETUP_CONTRACT':
        return {
          ...state,
          contract: action.payload
        }
      case 'ADD_ETHEREUM_ACCOUNTS':
        return {
          ...state,
          accounts: action.payload
        }
      case 'WEB3_LOADING_ERROR':
        return {
          ...state,
          web3LoadingErrorMessage: action.errorMessage,
          web3Loadded: false
        }
        case 'SET_NAME':
            return {
              ...state,
              name: action.payload
            }
            case 'SET_TOTALSUPPLY':
                return {
                  ...state,
                  totalSupply: action.payload
                }
                case 'SET_SYMBOL':
                    return {
                      ...state,
                      symbol: action.payload
                    }
                    case 'SET_TOKENSOLD':
                    return {
                      ...state,
                      tokenSold: action.payload
                    }
                    case 'SET_BALANCEOF':
                        return {
                          ...state,
                          balanceof: action.payload
                        }
                        case 'SET_TOKENPRICE':
                        return {
                          ...state,
                          tokenPrice: action.payload
                        }
                        case 'SET_TOKENNETWORKID':
                        return {
                          ...state,
                          networkID: action.payload
                        }
                         
                         
      default:
        return state;
    }
  }