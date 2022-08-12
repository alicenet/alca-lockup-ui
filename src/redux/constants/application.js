/**
 * @typedef {String} ApplicationActionType - Application Action Types -- Reducer State Constants
 */
export const APPLICATION_ACTION_TYPES = {
    SET_WEB3_CONNECTED: "SET_WEB3_CONNECTED",
    SET_WEB3_CONNECTING: "SET_WEB3_CONNECTING",
    SET_BALANCES: "SET_BALANCES",
    SET_BALANCES_LOADING: "SET_BALANCES_LOADING",
    SET_CONNECTED_ADDRESS: "SET_CONNECTED_ADDRESS",
    TOGGLE_TX_PENDING_STATUS: "TOGGLE_TX_PENDING_STATUS",
    UPDATE_NETWORK: "UPDATE_NETWORK"
};

/**
 * @typedef {String} ActionType - Supported action types swap|deposit
 */
export const ACTION_TYPES = {
    SWAP: "SWAP",
    DEPOSIT: "DEPOSIT",
}

/**
 * @typedef {String} TokenType - Supported token types for balances
 */
export const TOKEN_TYPES = {
    ETHEREUM: "ETHEREUM",
    ALICENET: "ALICENET",
    ALL: "ALL",
}