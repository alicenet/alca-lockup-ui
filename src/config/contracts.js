import abis from './abis';
import contract_names from './contract_names';

// ENUM KV for contract names and addresses, used to identify contracts throughout the application
export const CONTRACT_NAMES = contract_names;
export const CONTRACT_ADDRESSES = {};
export const CONTRACT_ABIS = {};

// Simplified access to all contract data
export const CONTRACTS = {};

export const RPC = {URL: ""};

// Extract names from process.env
for (let environmentKey of Object.keys(process.env)) {
    // Only parse _CONTRACT_ADDRESS keys for the contract name
    if (environmentKey.indexOf("_CONTRACT_ADDRESS") !== -1) {
        let contractName = environmentKey.replace("_CONTRACT_ADDRESS", "").replace("REACT_APP__", "");
        CONTRACT_NAMES[contractName] = contractName;
        CONTRACT_ADDRESSES[contractName] = process.env[environmentKey];
        CONTRACT_ABIS[contractName] = JSON.parse(abis[contractName]);
        CONTRACTS[contractName] = {
            name: contractName,
            address: process.env[environmentKey],
            abi: JSON.parse(abis[contractName]),
        }
    }
}

// Extract RPC
switch (process.env.REACT_APP__ENV) {
    case "LOCAL": RPC.URL = process.env.REACT_APP__ETHEREUM_ENDPOINT_LOCAL; break;
    case "STAGING": RPC.URL = process.env.REACT_APP__ETHEREUM_ENDPOINT_STAGING; break;
    case "PRODUCTION": RPC.URL = process.env.REACT_APP__ETHEREUM_ENDPOINT_PRODUCTION; break;
    default: RPC.URL = process.env.REACT_APP__ETHEREUM_ENDPOINT_STAGING; break; 
}

console.debug("Parsed contract information .env", CONTRACTS);
console.debug("Parsed RPC information", RPC);
