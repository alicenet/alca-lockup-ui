const { buildBytecodeFiles } = require('./buildBytecodeFiles');
const { buildAbiAndContractNameFiles } = require('./buildAbiAndContractNameFiles');
const sleeper = (amt) => ( (new Promise(res => setTimeout(res, amt))) );

main();

async function main() {

    console.log("\033[1;35m=====================================")
    console.log("========= TRANSPILER  START =========")
    console.log("=====================================\033[0m")
    
    console.log("\n\033[1;36mPreparing to transpile ABI and Contract Names to ES6 formats for src/config...\033[0m\n");
    await sleeper(1500);

    console.log("Transpiling ABI and Contract names to ES6 Syntax...\n");
    await buildAbiAndContractNameFiles();

    await sleeper(1500);
    console.log("Transpiling Bytecodes to ES6 Syntax...\n");
    await buildBytecodeFiles();

    console.log("\033[1;35m=====================================")
    console.log("========== TRANSPILER  END ==========")
    console.log("=====================================\033[0m\n")

    if (process.argv[2] === "startRun") {
        await sleeper(1500);
        console.log("Resuming start up...\n")
        await sleeper(1250)
    }

}