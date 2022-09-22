import 'ethers';
import { ethers } from 'ethers';
import config from 'config/_config';
import store from 'redux/store/store';
import { APPLICATION_ACTIONS } from 'redux/actions';
import { TOKEN_TYPES } from 'redux/constants';
import { CONTRACT_ADDRESSES } from 'config/contracts';
import utils from 'utils';

/** 
 * Re exported for easy importing
 * 
*/
export const CONTRACT_NAMES = config.CONTRACT_NAMES;

/**
 * Callback to run after establishing web3connection state pass or fail
 * @callback web3ConnectCallback
 * @param { Object } err - Will be null if no error, or else contain the error
 */
class EthAdapter {

    ////////////////////////////////////////////////////////
    /* Private Methods -- Scroll down for public methods */
    //////////////////////////////////////////////////////
    constructor() {
        this.accounts = []; // Web3 Accounts List 
        this.provider = null; // Web3 Provider -- Populated on successful _connectToWeb3Wallet()
        this.signer = null; // Web3 Signer -- Populated on successful _connectToWeb3Wallet()
        this.contracts = config.CONTRACTS; // Contracts from config
        this._setupWeb3Listeners();
        this.addressesFromFactory = {};
        this.timeBetweenBalancePolls = 7500;
        
        // Setup RPC provider
        this.provider = new ethers.providers.JsonRpcProvider(config.RPC.URL);
        
        console.debug("EthAdapter Init: ", this);
    }

    /**
     * Listen for balance updates
     */
    async _balanceLoop() {
        // Request accounts
        const accts = await this.provider.send("eth_requestAccounts", []); 
        if (accts.length === 0) {
            console.log("balfail")
            return;
        }

        this.updateBalances();
        setTimeout(this._balanceLoop.bind(this), this.timeBetweenBalancePolls);
    }

    /**
     * Setup web3 listeners for connected web3Wallet state changes
     */
    async _setupWeb3Listeners() {
        if (window.ethereum) {
            window.ethereum.on("networkChanged", networkId => {
                store.dispatch(APPLICATION_ACTIONS.updateNetwork(networkId));
                this.updateBalances();
            })
            window.ethereum.on("accountsChanged", async accounts => {
                this.accounts = accounts;
                let address = await this._getAddressByIndex(0);
                store.dispatch(APPLICATION_ACTIONS.setConnectedAddress(address));
                this.updateBalances();
            })
        } else {
            console.warn("No web3 detected.") // TODO: Add fallback
        }
    }

    /**
     * Get address from accounts[index] or return 0 if empty.
     * @param { Number } index - Index to get from this.accounts
     */
    async _getAddressByIndex(index = 0) {
        return this.accounts.length > 0 ? this.accounts[index] : "0x0";
    }

    /**
     * Returns an ethers.js contract instance that has been instanced without a signer for read-only calls
     * @param { contractName } contractName - One of the available contract name strings from config
     */
    _getReadonlyContractInstance(contractName) {
        this._requireContractExists(contractName);
        this._requireContractAddress(contractName);
        this._requireContractAbi(contractName);
        return new ethers.Contract(this.addressesFromFactory[contractName] || this.contracts[contractName].address, this.contracts[contractName].abi, this.provider);
    }

    /**
     * Returns an ethers.js contract instance that has been instanced with a signer ( this.signer )
     * @param { contractName } contractName - One of the available contract name strings from config
     */
    _getSignerContractInstance(contractName) {
        this._requireContractExists(contractName);
        this._requireContractAddress(contractName);
        this._requireContractAbi(contractName);
        this._requireSigner(contractName);
        return new ethers.Contract(this.addressesFromFactory[contractName] || this.contracts[contractName].address, this.contracts[contractName].abi, this.signer);
    }

    // TODO: FINISH DETERMINISTIC CONFIG SETUP
    /**
     * Get deterministic create2 contract address by contract name
     * @param { ContractName } contractName - One of the available contract name strings from config
     * @returns { web3.eth.Contract }
     */
    _getDeterministicContractAddress(contractName) {
        return `0x${this.web3.utils.sha3(`0x${[
            'ff',
            config.factoryContractAddress,
            config.CONTRACT_SALTS[contractName],
            this.web3.utils.sha3(config.CONTRACT_BYTECODE[contractName])
        ].map(x => x.replace(/0x/, '')).join('')}`).slice(-40)}`.toLowerCase();
    }

    /**
     * Throw exceptions
     * @param { String } msg
     */
    async _throw(msg) {
        throw new Error("eth/ethAdapter.js: " + msg);
    }

    /**
     * Internal contract settings requirement helper for contract functions
     * @param { String } contractName
     */
    _requireContractExists(contractName) {
        if (!this.contracts[contractName]) {
            this._throw("Contract configuration for contract '" + contractName + "' nonexistent. Verify contract has been set in .env");
        }
    }

    /**
     * Internal ABI requirement helper for contract functions
     * @param { String } contractName
     */
    _requireContractAbi(contractName) {
        if (!this.contracts[contractName].abi) {
            this._throw("Requesting contract instance for contract '" + contractName + "' with nonexistent abi. Verify ABI has been set.");
        }
    }

    /**
     * Internal contract address requirement helper for contract functions
     * @param { String } contractName
     */
    _requireContractAddress(contractName) {
        if (this.addressesFromFactory[contractName]) { return }
        if (!this.contracts[contractName].address) {
            this._throw("Requesting contract instance for contract '" + contractName + "' with nonexistant address. Verify address has been set.");
        }
    }

    /**
     * Internal signer requirement helper for contract functions
     * @param { String } contractName
     */
    _requireSigner(contractName) {
        if (!this.signer) {
            this._throw("Requesting contract instance for contract '" + contractName + "' but EthAdapter has not been provided a signer. Verify a signer has been set.");
        }
    }

    /**
     * Try a function, if it fails return the error with message nested as "error" in a plain object
     * @param { Function } func
     * @returns { Promise } - Function result or error
     */
    async _try(func) {
        try {
            return await func();
        } catch (ex) {
            console.error(ex);
            return { error: ex.message };
        }
    }

    /**
     * Attempt a call on a contract method
     * @param { ContractName } contractName - One of the available contract name strings from config
     * @param { String } methodName - Exact smart contract method name as a string
     * @param { Array } params - Contract method parameters as an array
     */
    async _tryCall(contractName, methodName, params = []) {
        let contract = this._getReadonlyContractInstance(contractName);
        let result = await contract[methodName](...params);
        // If return is a BN parse and return the value string, else just return
        if (ethers.BigNumber.isBigNumber(result)) {
            return result.toString();
        }
        return result;
    }

    /**
     * Attempt a send on a contract method
     * @param { ContractName } contractName - One of the available contract name strings from config
     * @param { String } methodName - Exact smart contract method name as a string
     * @param { Array } params - Contract method parameters as an array
     */
    async _trySend(contractName, methodName, params = []) {
        return await this._getSignerContractInstance(contractName)[methodName](...params);
    }

    async _lookupContractName(cName) {
        const contractAddress = await this._tryCall(CONTRACT_NAMES.Factory, "lookup", [ethers.utils.formatBytes32String(cName)]);
        return contractAddress;
    }


    /////////////////////
    /* Public Methods  */

    ////////////////////

    /**
     * Attempt to connect to a Web3 Wallet from window.ethereum
     * @param { web3ConnectCallback } cb - Callback to run after a connection contains err if error
     * @returns { String } - Connected Address
     */
    async connectToWeb3Wallet(cb) {
        try {
            this.provider = new ethers.providers.Web3Provider(window.ethereum, "any"); // Establish connection to injected wallet
            this.accounts = await this.provider.send("eth_requestAccounts", []); // Request accounts
            this.signer = this.provider.getSigner(); // Get the signer
            let connectedAddress = await this._getAddressByIndex(0);
            store.dispatch(APPLICATION_ACTIONS.updateNetwork(String(parseInt(window.ethereum.chainId, 16))));
            store.dispatch(APPLICATION_ACTIONS.setWeb3Connected(true));
            store.dispatch(APPLICATION_ACTIONS.setConnectedAddress(connectedAddress));
            cb(null, connectedAddress);

            // Lookup Contract Addresses
            for (let contract in this.contracts) {
                let address = await this._lookupContractName(contract);
                this.addressesFromFactory[contract] = address;
            }

            // Setup balance listener
            this._balanceLoop();
        } catch (ex) {
            console.error(ex);
            store.dispatch(APPLICATION_ACTIONS.setWeb3Connected(false));
            cb({ error: ex.message });
        }
    }

    /**
     * Disconnect Web3 Wallet from window.ethereum
     * @param { web3ConnectCallback } cb - Callback to run after a connection contains err if error
     * @returns { String } - Connected Address
     */
    async disconnectWeb3Wallet(cb) {
        try {
            store.dispatch(APPLICATION_ACTIONS.setWeb3Connected(false));
            store.dispatch(APPLICATION_ACTIONS.setConnectedAddress(""));
            cb(null);
        } catch (ex) {
            console.error(ex);
            cb({ error: ex.message });
        }
    }

    /**
     * Get Ether balance
     * @param { Number } accountIndex - Account index of this.accounts[i] to check balance for
     * @returns { Promise<String> } - Ethereum balance of this.accounts[accountIndex] as formatted string
     */
    async getEthereumBalance(accountIndex = 0) {
        return this._try(async () => {
            let balance = await this.provider.getBalance(this._getAddressByIndex(accountIndex))
            return ethers.utils.formatEther(balance);
        })
    }

    /**
     * Get ALCA balance
     * @param {Number} accountIndex - Account index to get ALCA for
     * @returns {String} - Balance of ALCA for given account index
     */
    async getAlcaBalance(accountIndex = 0) {
        return this._try(async () => {
            let balance = await this._tryCall(CONTRACT_NAMES.AToken, "balanceOf", [await this._getAddressByIndex(accountIndex)]);
            return ethers.utils.formatEther(balance);
        });
    }

    async getPublicStakingAllowance(accountIndex = 0) {
        return this._try(async () => {
            let allowance = await this._tryCall(CONTRACT_NAMES.AToken, "allowance", [await this._getAddressByIndex(accountIndex), CONTRACT_ADDRESSES.PublicStaking]);
            return allowance.toString();
        });
    }

    /**
     * Get staked ALCA
     * @param { Number } accountIndex - Account index to 
     * @returns { Object } - Lowest staked amount
     */
    async getStakedAlca(accountIndex = 0) {
        return this._try(async () => {
            const address = await this._getAddressByIndex(accountIndex);
            const tokenIds = await this._getTokenByIndex(address);
            const { getMinTokenValue } = utils.object;
            const meta = await this._getTokenMetaData(tokenIds);

            const stakedAlca = getMinTokenValue(meta);
            return {
                ...stakedAlca,
                stakedAlca: stakedAlca.shares ? ethers.utils.formatEther(stakedAlca.shares) : 0,
                ethRewards: stakedAlca.ethRewards || 0, 
                alcaRewards: stakedAlca.alcaRewards || 0
            };
        });
    }
    
    /**
     * Get all token id for a given address 
     * @param { String } address - Owner address
     * @returns { Array<Number> }
     */
    async _getTokenByIndex(address) {
        const tokenIds = [];
        let fetching = true;
        let index = 0;

        while (fetching) {
            try {
                const tokenId = await this._tryCall(
                    CONTRACT_NAMES.PublicStaking, 
                    "tokenOfOwnerByIndex", 
                    [address, index]
                );
                if (tokenId) tokenIds.push(tokenId); index++;
            } catch (error) { fetching = false; }
        }
        return tokenIds;
    }
    
    /**
     * Get metadata for each token
     * @param { Array<Number> } tokenIds - array of token ids
     * @returns { Object }
     */
    async _getTokenMetaData(tokenIds) {
        const meta = [];
        const { findTokenAttributeByName } = utils.object;
        const { parseTokenMetaData } = utils.string;

        for (let id of tokenIds) {
            const metadata = await this._tryCall(CONTRACT_NAMES.PublicStaking, "tokenURI", [id]);
            const { attributes } = parseTokenMetaData(metadata);
            const shares = findTokenAttributeByName(attributes, 'Shares');
            const ethRewards = await this.estimateEthCollection(id);
            const alcaRewards = await this.estimateTokenCollection(id);
            meta.push({ tokenId: id, shares: shares.value, ethRewards, alcaRewards });
        }
        return meta;
    }

    /**
     * Request a network change to the active web wallet in window.ethereum
     * @param { String } networkId - Network ID as a string -- Not Hexadecimal
     */
    async requestNetworkChange(networkId) {
        const hexChainId = "0x" + parseInt(networkId).toString(16);
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
        });
        this.updateBalances();
    }

    /**
     * Send a approve request for AToken allowance
     * @returns { Object }
     */
    async sendStakingAllowanceRequest() {
        return await this._try(async () => {
            const tx = await this._trySend(
                CONTRACT_NAMES.AToken, 
                "approve", 
                [
                    CONTRACT_ADDRESSES.PublicStaking, 
                    ethers.BigNumber.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
                ]
            )
            return tx;
        })
    }

    /**
     * Request a stake position to be opened
     * @param { Number } amount - Amount to be staked for a position
     * @returns { Object }
     */
    async openStakingPosition(amount) {
        return await this._try(async () => {
            const tx = await this._trySend(CONTRACT_NAMES.PublicStaking, "mint", [ethers.utils.parseEther(amount)]);
            return tx;
        })
    }

    /**
     * Request to exit a staked position
     * @param { Number } tokenId
     * @returns { Object }
     */
    async unstakingPosition(tokenId) {
        return await this._try(async () => {
            const tx = await this._trySend(CONTRACT_NAMES.PublicStaking, "burn", [tokenId]);
            return tx;
        })
    }

    /**
     * Get ETH rewards for a given token
     * @param { Number } tokenId
     * @returns { String }
     */
    async estimateEthCollection(tokenId) {
        return await this._try(async () => {
            const payout = await this._trySend(CONTRACT_NAMES.PublicStaking, "estimateEthCollection", [tokenId]);
            return ethers.utils.formatEther(payout);
        })
    }
    
    /**
     * Get ALCA rewards for a given token
     * @param { Number } tokenId 
     * @returns { String }
     */
    async estimateTokenCollection(tokenId) {
        return await this._try(async () => {
            const payout = await this._trySend(CONTRACT_NAMES.PublicStaking, "estimateTokenCollection", [tokenId]);
            return ethers.utils.formatEther(payout);
        })
    }

    /**
     * Claim all rewards for ETH
     * @param { Number } tokenId 
     * @returns { Object }
     */
    async collectEthProfits(tokenId) {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.PublicStaking, "collectEth", [tokenId]);
            return payoutTx;
        })
    }

    /**
     * Claim all rewards for both ETH and ALCA
     * @param { Number } tokenId 
     * @returns { Object }
     */
    async collectAllProfits(tokenId) {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.PublicStaking, "collectAllProfits", [tokenId]);
            return payoutTx;
        })
    }

    /**
     * TODO test only - remove before merging
     */
    async distributeRewards() {
        return await this._try(async () => {
            const options = { value: ethers.utils.parseEther("3").toString() };
            const ethTx = await this._trySend(CONTRACT_NAMES.PublicStaking, "depositEth", [42, options]);
            return { ethTx };
        })
    }

    /**
     * Sign a simple string with this.signer
     * @param { String } message - The string to sign
     * @returns { String } -- Signed message
     */
    async signSimpleStringMessage(message) {
        this._requireSigner();
        return await this.signer.signMessage(message);
    }

    /**
     * Signs the bytes of message with this.signer -- Useful for signing hashes
     * @param { String } message - The string to sign
     * @returns { String } -- Signed message
     */
    async signBytes(message) {
        this._requireSigner();
        const msgBytes = ethers.utils.arrayify(message);
        return await this.signer.signMessage(msgBytes)
    }

    /**
     * Sends dispatch to update the connected addresses ethereum balance
     */
    async updateBalances() {
        store.dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
    }

}

let ethAdapter = new EthAdapter();
export default ethAdapter;