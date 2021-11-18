/* Provides clear object exposure to .env configurations */
const environment = process.env.REACT_APP__ENVIRONMENT;

const throwNoEnvironment = () => { throw new Error("Incorrect environment, or no environment!") }

let web3endpoint;
let registryContractAddress;

// Determine Environment
switch (environment) {
    case "local": web3endpoint = process.env.REACT_APP__LOCAL_ETH_ENDPOINT; break;
    case "staging": web3endpoint = process.env.REACT_APP__STAGING_ETH_ENDPOINT; break;
    case "production": web3endpoint = process.env.REACT_APP__PRODUCTION_ETH_ENDPOINT; break;
    default: throwNoEnvironment();
}

// Determine Contract Addresses
switch (registryContractAddress) {
    case "local": registryContractAddress = process.env.REACT_APP__LOCAL_CONTRACT_REGISTRY_ADDRESS; break;
    case "staging": registryContractAddress = process.env.REACT_APP__STAGING_CONTRACT_REGISTRY_ADDRESS; break;
    case "production": endpoint = process.env.REACT_APP__PRODUCTION_CONTRACT_REGISTRY_ADDRESS; break;
    default: throwNoEnvironment();
}

// Set consts for contract names
const CONTRACT_NAMES = {
    REGISTRY_CONTRACT: "REGISTRY_CONTRACT",
}


export default {
    CONTRACT_NAMES: CONTRACT_NAMES,
    environment: environment,
    registryContractAddress: registryContractAddress,
    web3Endpoint: web3endpoint,
}