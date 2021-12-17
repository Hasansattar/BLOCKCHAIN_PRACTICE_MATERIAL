// Actions

export const setName = (name) => {
    return {
        type: 'SET_NAME',
        payload: name
    };
    
}

export const setSymbol = (symbol) => {
    return {
        type: 'SET_SYMBOL',
        payload: symbol
    };
}


export const setTotalSupply = (totalsupply) => {
    return {
        type: 'SET_TOTALSUPPLY',
        payload: totalsupply
    };
}
export const setTokensold = (tokensold) => {
    return {
        type: 'SET_TOKENSOLD',
        payload: tokensold
    };
}

export const setBalanceof = (balanceof) => {
    return {
        type: 'SET_BALANCEOF',
        payload: balanceof
    };
}

export const setTokenprice = (tokenprice) => {
    return {
        type: 'SET_TOKENPRICE',
        payload: tokenprice
    };
}


export const setTokenNetwork = (tokennetwork) => {
    return {
        type: 'SET_TOKENNETWORKID',
        payload: tokennetwork
    };
}



export const setupWeb3 = (web3) => {
    return {
        type: 'SETUP_WEB3',
        payload: web3
    };
}



export const setupContract = (contract) => {
    return {
        type: 'SETUP_CONTRACT',
        payload: contract
    };
}
export const addEthereumAccounts = (accounts) => {
    return {
        type: 'ADD_ETHEREUM_ACCOUNTS',
        payload: accounts
    };
}

export const web3LoadingError = (errorMessage) => {
    return {
        type: 'WEB3_LOADING_ERROR',
        errorMessage: errorMessage
    };
}


 