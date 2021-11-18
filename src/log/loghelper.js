import log from 'loglevel';

// Log Module Names
export const logModules = {
    REDUX_STATE: "REDUX_STATE",  // All things redux state, primarily reducer updates
    WEB3_HANDLER: "WEB3_HANDLER", // util/wallet
}

const GLOBAL_LEVEL = false; // "SILENT"" to silence all logs exported from this module
const EXCLUSIVE = false; // logModules.WEB3_HANDLER // Flag a module name for exclusive logging

// Log Modules Levels -- Set as needed
const logLevels = {
    REDUX_STATE: exclusityCheck("DEBUG", logModules.REDUX_STATE),
    WEB3_HANDLER: exclusityCheck("WEB3_HANDLER", logModules.WEB3_HANDLER),
}

// Addition Log Options -- Set as needed
export const ADDITIONAL_LOG_OPTS = {
    NONE_YET: false,
}

function exclusityCheck(level, moduleName) { return(!!EXCLUSIVE && EXCLUSIVE === moduleName ? "TRACE" : !EXCLUSIVE ? level : "SILENT"); }

const getSetLogLevel = (moduleType) => {
    log.getLogger(moduleType).setLevel(GLOBAL_LEVEL || logLevels[moduleType]);
    return log.getLogger(moduleType);
};

export const default_log = log;
export const reduxState_logger = getSetLogLevel(logModules.REDUX_STATE);
export const web3Handler_logger = getSetLogLevel(logModules.WEB3_HANDLER);