task("allowMigration", "Sets the AToken migration = true")
    .addParam("factoryAddress", "address of the factory deploying the contract")
    .setAction(async (taskArgs, hre) => {
        try {
            await allowMigration(hre, taskArgs.factoryAddress);
        } catch (error) { }
    });

async function allowMigration(
    hre: HardhatRuntimeEnvironment,
    factoryAddress: string,
): Promise<true> {
    const factory = await hre.ethers.getContractAt(
        "AliceNetFactory",
        factoryAddress
    );
    const [admin] = await hre.ethers.getSigners();
    const aTokenAddress = await factory.callStatic.lookup(
        hre.ethers.utils.formatBytes32String("AToken")
    );
    const aToken = await hre.ethers.getContractAt(
        "AToken",
        aTokenAddress
    )
    const calldata = aToken.interface.encodeFunctionData("allowMigration");
    // use the factory to call the A token minter
    let tx = await factory.connect(admin).callAny(aTokenAddress, 0, calldata);
    await tx.wait();
    return true;
}