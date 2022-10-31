require('dotenv').config()
const hre = require("hardhat");
const madTokenAbi = require('../external_abi/MadToken.json');

const madTokenAddress = process.env.MAD_TOKEN_ADDRESS;
const madTokenHolder = process.env.MAD_TOKEN_HOLDER;
const testingAddress = process.env.TESTING_ADDRESS;


async function main() {

    const MadTokenContract = new hre.ethers.Contract(madTokenAddress, madTokenAbi );

    // const AToken = await hre.ethers.getContractFactory("ATokenMock");
    // const aToken = await AToken.deploy(madTokenAddress);

    // await aToken.deployed();

    // console.log(`ATokenMock deployed to ${aToken.address} with legacyToken ${madTokenAddress} ... now initializing()...`);

    // let initializeTx = await (await aToken.initialize()).wait();
    // console.log(`ATokenMock initialized() successfully w/ TxHash: ${initializeTx.transactionHash}`)

    // console.log("Setting _migrationAllowed = true...");
    // let allowMigrationTx = await (await aToken.allowMigration()).wait();
    // console.log(`Migration permitted with txHash: ${allowMigrationTx.transactionHash}`)

    // Impersonate a MadToken holder and send tokens to .env TestingAddress
    console.log("Impersonating MadToken holder for transfer to testing address...");

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [madTokenHolder],
    });

    const impSigner = await ethers.getSigner(madTokenHolder)
    let madTokenContractImpersonated = MadTokenContract.connect(impSigner); 
    
    console.log(`Account(${madTokenHolder}) impersonated for contract ${madTokenContractImpersonated.address} , sending 10m tokens to ${testingAddress}`)
    let sendToTesting = await (await madTokenContractImpersonated.transfer(testingAddress, hre.ethers.utils.parseEther("10000000"))).wait()
    console.log(`10m tokens sent to ${testingAddress} successfully w/ hash ${sendToTesting.transactionHash}`);

    // Re-enable auto-mining
    await network.provider.send("evm_setAutomine", [true]);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
