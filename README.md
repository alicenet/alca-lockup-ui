
# Swap MadToken => ALCA Tokens

## Setting up and running in a dev environment

1. Run `cp  dotenv .env && cp hardhat-env/dotenv hardhat-env/.env ` in project root
2. Update `hardhat-env/.env` to have appropriate values, you will need to provide:
    - TESTING_ADDRESS - A testing address
    - ALCHEMY_API_KEY - An Alchemy API Key
    - MAD_TOKEN_HOLDER and MAD_TOKEN_ADDRESS can be left as defaults
3. In project root run `npm run ii` to install all dependencies
4. Prep the Hardhat environment with `npm run hh-prep`
5. Start the development node with by running `npm run hh-env` from the project root
6. Compile the contracts with `npm run hh-compile`
7. Deploy contracts to the development node with `npm run hh-deploy` from the project root
8. Start the UI with `npm start`
# Built from eth interface boilerplate

## Quick Start ( NO CREATE2 deterministic address generation support )

1. Add all contract artifacts to `/artifacts`

2. Add `REACT_APP__<CONTRACT_NAME>_CONTRACT_ADDRESS:<CONTRACT_ADDRESS>` for each contract to be used

3. Run `npm start`

All necessary files will be generated on npm start for ES6 Exports

##### You can then call Contract Methods as follows:

`import ethAdapter, { CONTRACT_NAMES } from 'eth/ethAdapter'`

Once the ethAdapter instance is available use: 

###### Read Only:

`let res = await ethAdapter.tryCall(CONTRACT_NAMES.<YOUR_CONTRACT>, <METHOD_NAME>, [<PARAMS>] )` 

###### Write Capable:

`let res = await ethAdapter.trySend(CONTRACT_NAMES.<YOUR_CONTRACT>, <METHOD_NAME>, [<PARAMS>] )` 

# TBD => Clean up detailed docs

## Running

##### It's as easy as 3 steps:

- Configure contracts as defined in Configuring Contracts Below

- `npm i`

- `npm start`

## Configuring Contracts

### Overview

config/contracts.js has all code related to gathering contract name, address, and ABI information. The goal is to only require changes to one file and add ABI files as needed.

Once .env is updated and artifacts are placed in `artifacts/` you are good to go.

Optionally, you can also place the bytecode object into `bytecode/` if you wish to utilize no-call CREATE2 deterministic address generation as noted below.

#### The ".env" file.

In the project root exists a .env file, this is the one that needs edited.

At minimum it should contain the following environment variables per contract named as described below where your contract name and address fill <CONTRACT_NAME> and <CONTRACT_ADDRESS> respectively.

`REACT_APP__<CONTRACT_NAME>_CONTRACT_ADDRESS:<CONTRACT_ADDRESS>`

###### <OPTIONAL> if using CREATE2 and nocall deterministic address feature ( See "Adding bytecode" below ):

Also include: 

`REACT_APP__FACTORY_CONTRACT_ADDRESS:<FACTORY_CONTRACT_ADDRESS>`

And for each contract salt to be used respectively:

`REACT_APP__<CREATE2_CONTRACT_NAME>_SALT: <CREATE2_CONTRACT_SALT>`

#### Adding Artifacts ( ABI Extraction )

The Artifacts should be added to the project root folder* 'artifacts' as follows: 

`./artifacts/<CONTRACT_NAME>.json`

###### *Note this is the project root not src/

These can be direct imports from the artifacts output of your compiler they just need to have *abi* as an Object key somewhere in the object*. 

**DO NOT* supply an object with multiple ABI keys anywhere in the object, the transpile will most likely fail. 

###### See the example STORAGE files in `./artifacts` for an idea.

Once Artifacts have been added, the following script needs to be run to compile the contract ABIs into parsed .js file code. 
This is done due to restrictions on ES6 File Imports, as we cannot import multiple files without 'fs' which is not available in React runtime/build sequence.

Run: `npm run transpile-abi run`

This transpiles the ABIs from the added artifact files into parseable ES6 syntax code in config/abis.js

**This script is also ran automatically on npm run start**

Though it can be beneficial to run it manually if you are making adjustments to the ABI on the fly.

#### OPTIONAL: Adding Bytecode ( Supporting CREATE2 Deterministic Addresses )

_create2 deterministic addresses are also supported, however the factory address,, and both the bytecode, and salt *per contract* must be noted for contracts to determine the addresses.

The benefit of this method is that no polling needs to be done to obtain information about complex contract sets, and can be determined before an ethereum wallet is even connected.

The Bytecode should be added to the project root folder* 'bytecode' as follows: 

`./bytecode/<CONTRACT_NAME>.json` where the bytecode is within the 'object' key of the json data.

###### *Note this is the project root not src/

** Please note that if both an address and bytecode are added, an error will throw if the deterministic address does not match the supplied address. **

The bytecode can be easily obtained from remix.ethereum.org's compiler panel where Bytecode can be copied and pasted directly into a json file at the location noted.

Once Bytecode has been added the following script must be run:

Run: `npm run transpile-bytecode run`

To transpile the ABIs from the added artifact files into parseable ES6 syntax code in config/bytecodes.js

**This script is also ran automatically on npm run start**

Though it can be beneficial to run it manually if you are making adjustments to on the fly.

#### Calling methods on your contract

After contracts have been added through the above methods, you're ready to call a contract method:

A contract method can be called by importing ethAdapter via:

`import ethAdapter, { CONTRACT_NAMES } from 'eth/ethAdapter'`

Once the ethAdapter instance is available use: 

###### Read Only:

`let res = await ethAdapter.tryCall(CONTRACT_NAMES.<YOUR_CONTRACT>, <METHOD_NAME>, [<PARAMS>] )` 

###### Write Capable:

`let res = await ethAdapter.trySend(CONTRACT_NAMES.<YOUR_CONTRACT>, <METHOD_NAME>, [<PARAMS>] )` 
