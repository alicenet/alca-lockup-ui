require('dotenv').config()
const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const hre = require("hardhat");
const madTokenAbi = require('../external_abi/MadToken.json');


describe("Allowance and Migration of MadTokens => ALCA Tokens", function () {

    const madTokenAddress = process.env.MAD_TOKEN_ADDRESS;
    const madTokenHolder = process.env.MAD_TOKEN_HOLDER;
    const testingAddress = process.env.TESTING_ADDRESS;

    let madImpSigner;
    let testAddressSigner;

    let MadTokenContract = new hre.ethers.Contract(madTokenAddress, madTokenAbi);
    let AToken;
    let aToken;

    let aTokenImpersonatedAsTestAddress
    let madTokenImpersonatedAsMadTokenHolder
    let madTokenImpersonatedAsTestAddress

    it("Should send 1 eth to the testing account", async function() {
        let signers = await hre.ethers.getSigners();
        let fundTx = await signers[0].sendTransaction({from: signers[0].address, to:testingAddress, value: hre.ethers.utils.parseEther("1")}) 
        await fundTx.wait();
    })

    it("Should be able to impersonate MadTokenHolder & Testing accounts on MadTokenContract", async function () {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [madTokenHolder],
        });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [testingAddress],
        });
        madImpSigner = await hre.ethers.getSigner(madTokenHolder)
        testAddressSigner = await hre.ethers.getSigner(testingAddress);
        madTokenImpersonatedAsMadTokenHolder = MadTokenContract.connect(madImpSigner);
        madTokenImpersonatedAsTestAddress = MadTokenContract.connect(testAddressSigner);
    })

    it("Should be able to send MadTokens to testing address with impersonated account", async function () {
        await (await madTokenImpersonatedAsMadTokenHolder.transfer(testingAddress, hre.ethers.utils.parseEther("10000000"))).wait()
        let madBalanceofTestAddress = await madTokenImpersonatedAsTestAddress.balanceOf(testingAddress)
        let  testingBal = madBalanceofTestAddress.toString()
        expect(testingBal).to.equal(hre.ethers.utils.parseEther("10000000"));
    })

    it("ATokenMock should be deployed", async function () {
        AToken = await hre.ethers.getContractFactory("ATokenMock");
        aToken = await AToken.deploy(madTokenAddress);
        await aToken.deployed();
    })

    it("Should verify legacy address set to MadToken contract address: 0x5b09a0371c1da44a8e24d36bf5deb1141a84d875", async function() {
        let legAddress = await aToken.getLegacyTokenAddress();
        expect(legAddress.toLowerCase()).to.equal(madTokenAddress.toLowerCase())
    })

    it('Should be able to initialize ATokenMock', async function () {
        await (await aToken.initialize()).wait();
    })

    it('Should be able to set allowMigration = true on ATokenMock', async function () {
        await (await aToken.allowMigration()).wait();
    })

    it("Testing address can allow 10m MadTokens for expense by contract", async function() {
        await madTokenImpersonatedAsTestAddress.approve(aToken.address, hre.ethers.utils.parseEther("10000000"))
        let approvedForMadTokenContract = await madTokenImpersonatedAsTestAddress.allowance(testingAddress, aToken.address)
        expect(approvedForMadTokenContract.toString()).to.equal(hre.ethers.utils.parseEther("10000000"))
    })

    it("Testing address can migrate 10m MadToken => ALCA by calling TokenA.migrate", async function() {
        aTokenImpersonatedAsTestAddress = aToken.connect(testAddressSigner);
        await aTokenImpersonatedAsTestAddress.migrate(hre.ethers.utils.parseEther("10000000"))
    })


});
