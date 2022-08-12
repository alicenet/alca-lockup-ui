const fs = require('fs/promises');
const util = require('./_util');

/**
 * Builds all ABI files, and additionally places extracted contract names in their respective config file.
 * @param {*} arg 
 */
module.exports.buildBytecodeFiles = async function buildBytecodeFiles(arg) {
    const bytecodeFiles = await fs.readdir('./bytecode/');

    const byteCodes = {};

    for (const bytecodeFilename of bytecodeFiles) {
        const bytecodeFile = await fs.readFile('./bytecode/' + bytecodeFilename)
        const bytecodeFileAsJSON = JSON.parse(bytecodeFile.toString());
        // Find object key and write ES6 syntax .js file for it
        let bytecode = util._recurseForObjectKey(bytecodeFileAsJSON, "object");
        const contractName = bytecodeFilename.replace('.json', "");
        byteCodes[contractName] = bytecode;
    }

    const es6Export = "const bytecodes = " + JSON.stringify(byteCodes) + "\nexport default bytecodes;";
    await fs.writeFile(__dirname + '/../src/config/bytecodes.js', es6Export, "utf8");

    console.log('\033[1;32mBytecodes Successfully Parsed to ES6 Syntax in src/config/\n\033[0m');

}

// Only run automatically on start from terminal
if (process.argv[2] === "run") {
    module.exports.buildBytecodeFiles(process.argv[2])
}