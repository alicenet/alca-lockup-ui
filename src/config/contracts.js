import abis from './abis';
import contract_names from './contract_names';

// ENUM KV for contract names and addresses, used to identify contracts throughout the application
export const CONTRACT_NAMES = contract_names;
export const CONTRACT_ADDRESSES = {};
export const CONTRACT_ABIS = {};

// Simplified access to all contract data
export const CONTRACTS = {};

// Extract names from process.env
for (let environmentKey of Object.keys(process.env)) {
    // Only parse _CONTRACT_ADDRESS keys for the contract name
    if (environmentKey.indexOf("_CONTRACT_ADDRESS") !== -1) {
        let contractName = environmentKey.replace("_CONTRACT_ADDRESS", "").replace("REACT_APP_", "");
        CONTRACT_NAMES[contractName] = contractName;
        CONTRACT_ADDRESSES[contractName] = process.env[environmentKey];
        // console.log(contractName);
        // console.log(abis);
        // console.log(abis[contractName]);
        CONTRACT_ABIS[contractName] = JSON.parse(abis[contractName]);
        CONTRACTS[contractName] = {
            name: contractName,
            address: process.env[environmentKey],
            abi: JSON.parse(abis[contractName]),
        }
    }
}

console.debug("Parsed contract information .env", CONTRACTS);