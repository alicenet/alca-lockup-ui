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
    SET_APPROVAL_HASH: "SET_APPROVAL_HASH",
    SET_STAKED_POSITION: "SET_STAKED_POSITION",
    TOGGLE_TX_PENDING_STATUS: "TOGGLE_TX_PENDING_STATUS",
    UPDATE_NETWORK: "UPDATE_NETWORK",
    UPDATE_HAS_READ_TERMS: "UPDATE_HAS_READ_TERMS",
    UPDATE_STARTING_BALANCES: "UPDATE_STARTING_BALANCES",
    SET_LOCKED_POSITION: "UPDATE_LOCKED_POSITION",
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
    ETHEREUM: "ETHEREUM"
}

/**
 * @typedef {String} LockupPeriodStatus - Supported token types for balances
 */
export const LOCKUP_PERIOD_STATUS = {
    START: "START",
    LOCKED: "LOCKED",
    END: "END"
}