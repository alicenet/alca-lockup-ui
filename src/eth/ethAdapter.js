import 'ethers';
import { ethers } from 'ethers';
import config from 'config/_config';
import store from 'redux/store/store';
import { APPLICATION_ACTIONS } from 'redux/actions';
import { TOKEN_TYPES, LOCKUP_PERIOD_STATUS } from 'redux/constants';
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

        await this.updateBalances();
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

    // TODO Rework contract names to the expected Salt 
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
            store.dispatch(APPLICATION_ACTIONS.setConnectedAddress(connectedAddress));
            
            // Lookup Contract Addresses
            for (let contract in this.contracts) {
                if (contract === "Factory") { continue }
                let address = await this._lookupContractName(contract);
                this.addressesFromFactory[contract] = address;
            }

            // Setup balance listener
            await this._balanceLoop();
            
            cb(null, connectedAddress);
            store.dispatch(APPLICATION_ACTIONS.setWeb3Connected(true));
            
            return;
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
     * Safe transfer  
     * @param tokenID nft id held by lockup
     * @returns { Object }
     */
     async lockupStakedPosition(tokenID) {
        return await this._try(async () => {
            const address = await this._getAddressByIndex(0);
            const tx = await this._trySend(CONTRACT_NAMES.PublicStaking, "safeTransferFrom(address,address,uint256)", [
                address, 
                this.addressesFromFactory.Lockup, 
                tokenID
            ]);
            return tx;
        })
    }

    /**
     * Get token by address
     * @param { Number } accountIndex - Account index of this.accounts[i]
     * @returns { Object }
     */
     async getLockedPosition(accountIndex = 0) {
        return await this._try(async () => {
            const address = await this._getAddressByIndex(accountIndex);
            const tokenId = await this._trySend(CONTRACT_NAMES.Lockup, "tokenOf", [address]);
            const { payoutEth = 0, payoutToken = 0 } = tokenId > 0 ? await this.estimateProfits(tokenId) : {};
            const { shares = 0 } = tokenId > 0 ? await this._trySend(CONTRACT_NAMES.PublicStaking, "getPosition", [tokenId]) : 0 ;
            const end = await this.getLockupEnd();
            const blockNumber = await this.provider.getBlockNumber();
            const SCALING_FACTOR = await this._tryCall(CONTRACT_NAMES.Lockup, "SCALING_FACTOR");
            const FRACTION_RESERVED = await this._tryCall(CONTRACT_NAMES.Lockup, "FRACTION_RESERVED");
            const penalty = ethers.BigNumber.from(FRACTION_RESERVED).mul(100).div(SCALING_FACTOR);
            const remainingRewards = 100 - penalty

            return { 
                lockedAlca: ethers.utils.formatEther(shares),
                payoutEth: ethers.utils.formatEther(payoutEth), 
                payoutToken: ethers.utils.formatEther(payoutToken),
                tokenId,
                lockupPeriod: (ethers.BigNumber.from(end).gt(blockNumber)) ? LOCKUP_PERIOD_STATUS.LOCKED : LOCKUP_PERIOD_STATUS.END,
                penalty: penalty.toString(),
                blockUntilUnlock: ethers.BigNumber.from(end).sub(blockNumber).toString(),
                remainingRewards,
            }; 
        })
    }

    /**
     * Unlock and claim ownership of locked position and rewards
     * @param tokenID nft id held by lockup
     * @returns { Object }
     */
    async sendExitLock(tokenID) {
        return await this._try(async () => {
            const address = await this._getAddressByIndex(0);
            const tx = await this._trySend(CONTRACT_NAMES.Lockup, "unlock", [address, tokenID]);
            return tx;
        })
    }

    /**
     * Early exit on your locked position, loses 20% of rewards and bonus ALCA
     * @param exitValue nft id held by lockup
     * @returns { Object }
     */
    async sendEarlyExit(exitValue) {
        return await this._try(async () => {
            const tx = await this._trySend(CONTRACT_NAMES.Lockup, "unlockEarly", [ethers.utils.parseEther(exitValue), false]);
            return tx;
        })
    }

    /**
     * Get ETH rewards for a given token in lockup
     * @param { Number } tokenId
     * @returns { Object }
     */
     async estimateProfits(tokenId) {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.Lockup, "estimateProfits", [tokenId]);
            return payoutTx;
        })
    }
    
    /**
     * Get ALCA rewards for a given token in lockup
     * @param { Number } tokenId 
     * @returns { Object }
     */
    async estimateFinalBonusProfits(tokenId) {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.Lockup, "estimateFinalBonusWithProfits", [tokenId]);
            return payoutTx;
        })
    }

    /**
     * Claim all rewards for both ETH and ALCA from lockup
     * @returns { Object }
     */
     async collectAllProfits() {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.Lockup, "collectAllProfits");
            return payoutTx;
        })
    }

    /**
     * Aggregate all profits
     * @returns { Object }
     */
     async aggregateProfits() {
        return await this._try(async () => {
            const payoutTx = await this._trySend(CONTRACT_NAMES.Lockup, "aggregateProfits");
            return payoutTx;
        })
    }

    /**
     * Get first block number in the lockup period
     * @returns { Number }
     */
     async getLockupStart() {
        return await this._try(async () => {
            const block = await this._trySend(CONTRACT_NAMES.Lockup, "getLockupStartBlock");
            return block;
        })
    }

    /**
     * Get end block number in the lockup period
     * @returns { Object }
     */
     async getLockupEnd() {
        return await this._try(async () => {
            const block = await this._trySend(CONTRACT_NAMES.Lockup, "getLockupEndBlock");
            return block;
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
        await store.dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
    }
}

const ethAdapter = new EthAdapter();
export default ethAdapter;