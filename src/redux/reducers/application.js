import { APPLICATION_ACTION_TYPES, ACTION_TYPES } from "redux/constants";

//contains all information to describe application state
const initialApplicationState = {
    web3Connected: false,
    web3Connecting: false,
    balancesLoading: false,
    balances: {
        alca: 0,
        alcb: 0,
        ethereum: 0,
        mad: 0,
        stakedAlca: 0,
    },
    startingBalances: {
        mad: 0,
        alca: 0
    },
    allowances: {
        mad: 0,
        alcaStakeAllowance: 0,
    },
    rewards: {
        alca: 0,
        eth: 0,
    },
    alcaExchangeRate: 0, // MadTokens => Alca :: Example... If this == 3... 1 MadToken == 3 ALCA || madTokens * alcaExchangeRate = estimateReturnedAlcaTokens
    connectedAddress: "",
    approvalHash: "",
    migrationHash: "",
    migrationAmount: 0,
    networkId: "",
    networkName: "",
    txStatuses: Object.keys(ACTION_TYPES).map(action => {
        return {
            actionType: action,
            recentTxHash: "",
            pending: false,
            error: false,
            errorMessage: "",
        }
    }),
    hasReadTerms: false
};

export default function applicationReducer(state = initialApplicationState, action) {
    switch (action.type) {

        case APPLICATION_ACTION_TYPES.SET_WEB3_CONNECTED:
            return Object.assign({}, state, {
                web3Connected: action.payload
            });

        case APPLICATION_ACTION_TYPES.SET_WEB3_CONNECTING:
            return Object.assign({}, state, {
                web3Connecting: action.payload
            });

        case APPLICATION_ACTION_TYPES.SET_CONNECTED_ADDRESS:
            return Object.assign({}, state, {
                connectedAddress: action.payload
            });

        case APPLICATION_ACTION_TYPES.SET_BALANCES:
            return Object.assign({}, state, {
                balances: { ...state.balances, ...action.payload },

            });

        case APPLICATION_ACTION_TYPES.SET_ALLOWANCES:
            return Object.assign({}, state, {
                allowances: { ...state.allowances, ...action.payload },
            });

        case APPLICATION_ACTION_TYPES.TOGGLE_TX_PENDING_STATUS:
            const status = state.txStatuses.find(txStatus => txStatus.actionType === action.payload);
            const toggled = { ...status, pending: !status.pending };
            return Object.assign({}, state, {
                txStatuses: { ...state.txStatuses, ...toggled },
            });

        case APPLICATION_ACTION_TYPES.SET_BALANCES_LOADING:
            return Object.assign({}, state, {
                balancesLoading: action.payload,
            })

        case APPLICATION_ACTION_TYPES.UPDATE_NETWORK:
            return Object.assign({}, state, {
                networkId: action.payload.id,
                networkName: action.payload.name
            })

        case APPLICATION_ACTION_TYPES.UPDATE_EXCHANGE_RATE:
            return Object.assign({}, state, {
                alcaExchangeRate: action.payload
            })

        case APPLICATION_ACTION_TYPES.UPDATE_HAS_READ_TERMS:
            return Object.assign({}, state, {
                hasReadTerms: action.payload
            })

        case APPLICATION_ACTION_TYPES.SET_APPROVAL_HASH:
            return Object.assign({}, state, {
                approvalHash: action.payload
            })

        case APPLICATION_ACTION_TYPES.SET_MIGRATION_HASH:
            return Object.assign({}, state, {
                migrationHash: action.payload
            })

        case APPLICATION_ACTION_TYPES.UPDATE_STARTING_BALANCES:
            return Object.assign({}, state, {
                startingBalances: action.payload
            })


        case APPLICATION_ACTION_TYPES.UPDATE_MIGRATION_AMOUNT:
            return Object.assign({}, state, {
                migrationAmount: action.payload
            })

        default:
            return state;
    }
};