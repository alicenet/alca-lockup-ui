const fs = require('fs/promises');
const util = require('./_util');

/**
 * Builds all ABI files, and additionally places extracted contract names in their respective config file for intellisense to work properly on CONTRACT_NAMES.
 * @param {*} arg 
 */
module.exports.buildAbiAndContractNameFiles = async function buildAbiFiles(arg) {

    const AbiFiles = await fs.readdir('./artifacts/');

    const ABIS = {};
    const CONTRACT_NAMES = {};

    for (const abiFileName of AbiFiles) {
        const abiFile = await fs.readFile('./artifacts/' + abiFileName)
        const abiFileAsJSON = JSON.parse(abiFile.toString());
        // Find ABI and write ES6 syntax .js file for it
        const abi = (!Array.isArray(abiFileAsJSON)) ? util._recurseForObjectKey(abiFileAsJSON, "abi") : abiFileAsJSON;
        const abiObj = abi;
        const abiJson = JSON.stringify(abiObj);
        const contractName = abiFileName.replace('.json', "");
        ABIS[contractName] = abiJson;
        CONTRACT_NAMES[contractName] = contractName;
    }

    const AbiES6Export = "const abis = " + JSON.stringify(ABIS) + "\nexport default abis;";
    await fs.writeFile(__dirname + '/../src/config/abis.js', AbiES6Export, "utf8");

    const contractNamesES6 = "const CONTRACT_NAMES = " + JSON.stringify(CONTRACT_NAMES) + "\nexport default CONTRACT_NAMES;";
    await fs.writeFile(__dirname + '/../src/config/contract_names.js', contractNamesES6, "utf8");

    console.log('\033[1;32mABIs and CONTRACT_NAMES Successfully Parsed to ES6 Syntax in src/config/\n\033[0m');

}

// Only run automatically on start from terminal
if (process.argv[2] === 'run') {
    module.exports.buildAbiAndContractNameFiles(process.argv[2])
}