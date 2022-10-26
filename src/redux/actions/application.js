import config from 'config/_config';
import ethAdapter from 'eth/ethAdapter';
import { APPLICATION_ACTION_TYPES, TOKEN_TYPES } from 'redux/constants';
import { toast } from 'react-toastify';

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
 * @returns {Promise}
 */
export const updateBalances = tokenType => {
    return async function (dispatch, getState) {
        let state = getState();
        let ethBalance = state.application.balances.ethereum;
        let alcaBal = state.application.balances.alca;
        let stakedPosition = state.application.balances.stakedPosition;
        let lockedPosition = state.application.balances.lockedPosition;

        if (tokenType === TOKEN_TYPES.ETHEREUM || tokenType === TOKEN_TYPES.ALL) {
            ethBalance = await ethAdapter.getEthereumBalance(0);
        }
        if (tokenType === TOKEN_TYPES.ALCA || tokenType === TOKEN_TYPES.ALL) {
            alcaBal = await ethAdapter.getAlcaBalance(0);
            stakedPosition = await ethAdapter.getStakedAlca(0);
            lockedPosition = await ethAdapter.getLockedPosition(0);
        }

        if (ethBalance.error) {
            toast("Error fetching ETH balance.", { type: "error", position: "bottom-center", autoClose: 1000 })
        }

        if (alcaBal.error) {
            toast("Error fetching ALCA balance.", { type: "error", position: "bottom-center", autoClose: 1000 })
        }

        if (ethBalance.error || alcaBal.error) {
            console.error("Contract error, are you on the correct network?");
            return; 
        }

        if (!stakedPosition.error) {
            dispatch({
                type: APPLICATION_ACTION_TYPES.SET_STAKED_POSITION,
                payload: {
                    stakedAlca: stakedPosition.stakedAlca,
                    tokenId: stakedPosition.tokenId,
                    ethRewards: stakedPosition.ethRewards,
                    alcaRewards: stakedPosition.alcaRewards,
                }
            });
        }

        if (!lockedPosition.error) {
            dispatch({type: APPLICATION_ACTION_TYPES.SET_LOCKED_POSITION, 
                payload: {
                    lockedAlca: lockedPosition.lockedAlca,
                    tokenId: lockedPosition.tokenId,
                    ethReward: lockedPosition.payoutEth, 
                    alcaReward: lockedPosition.payoutToken,
                    lockupPeriod: lockedPosition.lockupPeriod,
                    penalty: lockedPosition.penalty,
                    remainingRewards: lockedPosition.remainingRewards,
                    unlockDate: lockedPosition.blockUntilUnlock
                }
            })
        }
        
        dispatch({
            type: APPLICATION_ACTION_TYPES.SET_BALANCES,
            payload: {
                ethereum: ethBalance,
                alca: alcaBal || 0, // Fallback to 0 if token doesn't exist on network
            }
        });

    }
};

export const checkAgreeCookieState = (agreeCookie) => {
    return async function (dispatch) {
        if (agreeCookie.agreed === 'true') {
            dispatch({
                type: APPLICATION_ACTION_TYPES.UPDATE_HAS_READ_TERMS,
                payload: true
            })
        } else {
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
