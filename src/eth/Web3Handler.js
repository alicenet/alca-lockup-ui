import abis from './abi/_abis';
import config from 'config/config.js';
import { web3Handler_logger as log } from 'log/loghelper.js'
import Web3Modal from 'web3modal';
import Web3 from 'web3';

/* Web3 Handler for PixelCats */
class Web3Handler {

    constructor() {

        this.web3Modal = new Web3Modal();

        // Contract collection
        this.contracts = {
            [config.CONTRACT_NAMES.REGISTRY_CONTRACT]: {
                address: config.registryContractAddress,
                abi: config.registryContractABI,
                instance: null
            }
        }

        log.debug(`CONFIG: Using HTTP Endpoint as Provider: ${httpEndpoint}`);

        this.web3provider = null;
        this.web3 = new web3(config.web3Endpoint);
        
        this._setup()
    }

    _setup() {
        log.debug(`CONFIG: RegistryContract Address: ${this.registryContractAddress}`);
        this._initContracts();
    }

    _initContracts() {
        this.contracts = this.web3.eth.Contract(this.registryContractABI, this.registryContractAddress);
    }

    _getContractMethod(contractName, methodName, params) {
        try {
            return params ? this.contracts[contractName].instance.methods[methodName](...params) : this.contracts[contractName].methods[methodName]();
        } catch (ex) {
            console.error(ex);
        }
    }

    async connectWeb3(cb = () => { }) {
        this.web3provider = await this.web3Modal.connect();
        this.web3 = new Web3(this.web3provider);
        this._initContracts(); // Re-init contracts on connect
        cb();
    }

    async _tryCall(method) {
        try {
            return await method.call()
        } catch (ex) {
            console.error(ex);
            return { error: ex }
        }
    }

    async _trySend(method, from, value) {
        try {
            return await method.send({ from: from, value: value });
        } catch (ex) {
            console.error(ex);
            return { error: ex }
        }
    }

    async methodCallExample() {
        return await this._tryCall(this._getContractMethod(config.CONTRACT_NAMES.REGISTRY_CONTRACT, "contractMethodName"))
    }


}

const web3Handler = new Web3Handler();

export default web3Handler;