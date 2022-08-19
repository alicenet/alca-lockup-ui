/**
 * @typedef {String} ApplicationActionType - Application Action Types -- Reducer State Constants
 */
export const APPLICATION_ACTION_TYPES = {
    SET_WEB3_CONNECTED: "SET_WEB3_CONNECTED",
    SET_WEB3_CONNECTING: "SET_WEB3_CONNECTING",
    SET_ALLOWANCES: "SET_ALLOWANCES",
    SET_BALANCES: "SET_BALANCES",
    SET_BALANCES_LOADING: "SET_BALANCES_LOADING",
    SET_CONNECTED_ADDRESS: "SET_CONNECTED_ADDRESS",
    SET_MIGRATION_HASH: "SET_MIGRATION_HASH",
    SET_APPROVAL_HASH: "SET_APPROVAL_HASH",
    TOGGLE_TX_PENDING_STATUS: "TOGGLE_TX_PENDING_STATUS",
    UPDATE_NETWORK: "UPDATE_NETWORK",
    UPDATE_EXCHANGE_RATE: "UPDATE_EXCHANGE_RATE", 
    UPDATE_HAS_READ_TERMS: "UPDATE_HAS_READ_TERMS"
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
    ALL: "ALL",
    ALCA: "ALCA",
    ALCB: "ALCB",
    ETHEREUM: "ETHEREUM",
    MADTOKEN: "MADTOKEN"
}