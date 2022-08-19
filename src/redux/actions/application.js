import config from 'config/_config';
import ethAdapter from 'eth/ethAdapter';
import { APPLICATION_ACTION_TYPES, TOKEN_TYPES } from 'redux/constants';

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
        networkName = Object.keys(config.METAMASK_NETWORKS).map((key) => {
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
        let madBal = state.application.balances.mad;
        let madAllowance = state.application.allowances.mad;
        let alcaBal = state.application.balances.alca;

        if (tokenType === TOKEN_TYPES.ETHEREUM || tokenType === TOKEN_TYPES.ALL) {
            ethBalance = await ethAdapter.getEthereumBalance(0);
        }
        if (tokenType === TOKEN_TYPES.MADTOKEN || tokenType === TOKEN_TYPES.ALL) {
            madBal = await ethAdapter.getMadTokenBalance(0);
            madAllowance = await ethAdapter.getMadTokenAllowance(0);
        }
        if (tokenType === TOKEN_TYPES.ALCA || tokenType === TOKEN_TYPES.ALL) {
            alcaBal = await ethAdapter.getAlcaBalance(0);
        }

        let publicStakingAllowance = await ethAdapter.getPublicStakingAllowance();

        dispatch({
            type: APPLICATION_ACTION_TYPES.SET_BALANCES,
            payload: {
                ethereum: parseFloat(ethBalance).toFixed(4),
                mad: parseInt(madBal) || 0, // Fallback to 0 if token doesn't exist on network
                alca: parseInt(alcaBal) || 0 // Fallback to 0 if token doesn't exist on network
            }
        });
        dispatch({
            type: APPLICATION_ACTION_TYPES.SET_ALLOWANCES,
            payload: {
                mad: parseInt(madAllowance) || 0, // Fallback to 0 if token doesn't exist on network
                alcaStakeAllowance: publicStakingAllowance || "0"
            }
        });

    }
};

export const updateExchangeRate = (madTokenAmt) => {
    return async function (dispatch) {
        let exchangeRate = await ethAdapter.getMadTokenToALCAExchangeRate(madTokenAmt);
        dispatch({
            type: APPLICATION_ACTION_TYPES.UPDATE_EXCHANGE_RATE,
            payload: exchangeRate
        })
    }
}

export const checkAgreeCookieState = (agreeCookie) => {
    return async function (dispatch) {
        if (agreeCookie.agreed === 'true') {
            dispatch({
                type: APPLICATION_ACTION_TYPES.UPDATE_HAS_READ_TERMS,
                payload: true
            })
        } else {
            console.log("DISPATCH NO GO")
            dispatch({
                type: APPLICATION_ACTION_TYPES.UPDATE_HAS_READ_TERMS,
                payload: false
            })
        }
    }
}

export const setAgreeStateTrue = () => {
    return async function (dispatch) {
        dispatch({ type: APPLICATION_ACTION_TYPES.UPDATE_HAS_READ_TERMS, payload: true });
    }
}

export const updateApprovalHash = (txHash) => {
    return async function (dispatch) {
        dispatch({
            type: APPLICATION_ACTION_TYPES.SET_APPROVAL_HASH,
            payload: txHash
        })
    }
}

export const updateMigrationHash = (txHash) => {
    return async function (dispatch) {
        dispatch({
            type: APPLICATION_ACTION_TYPES.SET_MIGRATION_HASH,
            payload: txHash
        })
    }
}
