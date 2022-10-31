require('dotenv').config()
const hre = require("hardhat");

async function main() {
    
    const adminAddress = "0x546f99f244b7b58b855330ae0e2bc1b30b41302f";
    const val1 = "0x2718A6732b2E320573a0B28918CdE867eAfd8E06";
    const val2 = "0x6F863ceC808779cbd00EC712CFE350D3E8E685F7";
    const val3 = "0xBe4797A540D736555c134B1C4cE54D2Eb96Db6cF";
    const val4 = "0x4eD671cCd55371278fDeC9400beF4F900164f550"
    console.log("Funding admin...");

    let signers = await hre.ethers.getSigners();
    let tx1 = await signers[9].sendTransaction({ to:adminAddress, value: hre.ethers.utils.parseEther("1000")})
    let tx2 = await signers[8].sendTransaction({ to:val1, value: hre.ethers.utils.parseEther("1000")})
    let tx3 = await signers[7].sendTransaction({ to:val2, value: hre.ethers.utils.parseEther("1000")})
    let tx4 = await signers[6].sendTransaction({ to:val3, value: hre.ethers.utils.parseEther("1000")})
    let tx5 = await signers[5].sendTransaction({ to:val4, value: hre.ethers.utils.parseEther("1000")})

    await tx1.wait();
    await tx2.wait();
    await tx3.wait();
    await tx4.wait();
    await tx5.wait();

    console.log(`Admin addresses funded ${adminAddress, val1, val2, val3, val4}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
