import { ethers } from "ethers";

/**
 * Calculates minimum ETH received based on slippage percentage
 * @param { String } expectedAmount - The amount of tokens expected
 * @param { String } slippage - The slippage tolerance input
 * @returns { String } - The minimum amount expected
 */
export const calcMinimumWeiReceived = (expectedAmountInWei, slippage) => {
    // console.log("calMinEth", {
    //     expectedAmountInWei: expectedAmountInWei,
    //     slippage: slippage
    // })
    let minWeiReceieved = 0;
    minWeiReceieved = Math.floor(expectedAmountInWei - (expectedAmountInWei * slippage));
    if (minWeiReceieved < 1) {
        return 0;
    }
    return (ethers.BigNumber.from(String(minWeiReceieved)));
}

/**
 * Calculates minimum ALCB received based on slippage percentage
 * @param { String } expectedAmount - The amount of tokens expected
 * @param { String } slippage - The slippage tolerance input
 * @returns { String } - The minimum amount expected
 */
export const calculateMinAlcbReceived = (expectedAmount, slippage) => {

    let expectedAmountAsBN = ethers.BigNumber.from(expectedAmount);
    let minAmtAsBN = expectedAmountAsBN.sub(expectedAmountAsBN.mul(slippage*100).div(100));

    // console.log("calMinAlcb", {
    //     expectedAmountAsBN: expectedAmountAsBN.toString(),
    //     minAmtAsBN: minAmtAsBN.toString(),
    // })

    return minAmtAsBN.toString();
}