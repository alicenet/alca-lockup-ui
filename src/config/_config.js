import * as contractsConfig from './contracts';
import * as networkTypes from './network_types';

const configuration = {
    CONTRACTS: contractsConfig.CONTRACTS,
    CONTRACT_ABIS: contractsConfig.CONTRACT_ABIS,
    CONTRACT_ADDRESSES: contractsConfig.CONTRACT_ADDRESSES,
    CONTRACT_NAMES: contractsConfig.CONTRACT_NAMES,
    METAMASK_NETWORKS: networkTypes.METAMASK_NETWORKS,
    RPC: contractsConfig.RPC
}

export default configuration;