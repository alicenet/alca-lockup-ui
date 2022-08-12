import config from 'config/_config';
import ethAdapter from 'eth/ethAdapter';
import { APPLICATION_ACTION_TYPES } from 'redux/constants';
import { TOKEN_TYPES } from "redux/constants";

/**
 * Set UI state for if a web3Wallet is connected
 * @param {Boolean} isConnected - Is the web3 wallet connected? 
 * @returns 
 */
export const setWeb3Connected = isConnected => {
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.SET_WEB3_CONNECTED, payload: isConnected })
    }
};

/**
 * Set the state for if a web3Wallet connection is pending
 * @param {Boolean} busyState - Boolean if web3 is currently attempting to connect  
 * @returns 
 */
export const setWeb3Connecting = busyState => {
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.SET_WEB3_CONNECTING, payload: busyState })
    }
};

/**
 * Set the currently connected address to redux state
 * @param { String } address - Address to set to state 
 * @returns 
 */
export const setConnectedAddress = address => {
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.SET_CONNECTED_ADDRESS, payload: address })
    }
}

/**
 * Updates current network state by ID -- Will determine name relative to ID
 * @param { String } networkId - Network ID to set to state 
 * @returns 
 */
export const updateNetwork = (networkId) => {
    // Get network name from network key -- Shouldn't fail but try/catch in case it does
    let networkName;
    try {
        networkName = Object.keys(config.METAMASK_NETWORKS).map( (key) => {
            if (config.METAMASK_NETWORKS[key].id === networkId) {
                return config.METAMASK_NETWORKS[key].name;
            }
            throw new Error("Cannot determine network name");
        })[0];
    } catch (ex) {
        console.warn("Unable to determine network name:", ex);
    }
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.UPDATE_NETWORK, payload: { name: networkName, id: networkId } });
    }
}

/**
 * Set balance by accepted tokenType
 * @param {String} balance - String of current balance for tokenType 
 * @param {TokenType} tokenType - Token type to set balance for
 * @returns 
 */
export const setBalance = (balance, tokenType) => {
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.SET_BALANCES, payload: { balance: balance, token: tokenType } })
    }
};

/**
 * Toggle the tx pending status for application actions
 * @param {ActionType} action - Action to toggle the tx status for
 * @returns 
 */
export const toggleTxPendingStatus = (action) => {
    return dispatch => {
        dispatch({ type: APPLICATION_ACTION_TYPES.TOGGLE_TX_PENDING_STATUS, payload: action })
    }
};

/**
 * Request and update balance state for requested token type
 * @param {TokenType} tokenType 
 * @returns 
 */
export const updateBalances = tokenType => {
    return async function (dispatch, getState) {
        let state = getState();
        let ethBalance = state.application.balances.ethereum;
        let aBytesBal = state.application.balances.aliceBytes;
        if (tokenType === TOKEN_TYPES.ETHEREUM || tokenType === TOKEN_TYPES.ALL) {
            ethBalance = await ethAdapter.getEthereumBalance(0);
        }
        if (tokenType === TOKEN_TYPES.ALICENET || tokenType === TOKEN_TYPES.ALL) {
            aBytesBal = await ethAdapter.getALCBTokenBalance(0);
        }
        dispatch({ 
            type: APPLICATION_ACTION_TYPES.SET_BALANCES, 
            payload: { 
                ethereum: parseFloat(ethBalance).toFixed(4), 
                aliceBytes: parseInt(aBytesBal) || 0 // Fallback to 0 if token doesn't exist on network
            } 
        });
    }
};