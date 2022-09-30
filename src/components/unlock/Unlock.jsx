import React from "react";
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Input, Button } from "semantic-ui-react";
import { classNames } from "utils/generic";
import { TOKEN_TYPES } from "redux/constants";

const DECIMALS = 18;
const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Unlock() {

    const { stakedAlca, alcaBalance, alcaStakeAllowance, lockedAlca, unlockDate } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        alcaBalance: state.application.balances.alca,
        alcaStakeAllowance: state.application.allowances.alcaStakeAllowance,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        unlockDate: state.application.lockedPosition.unlockDate,
    }))

    const dispatch = useDispatch();

    //figure out how to update this
    //user's staked amount
    const [stakeAmt, setStakeAmt] = React.useState("");
    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [allowanceMet, setAllowanceMet] = React.useState(false);
    const [hash, setHash] = React.useState("");

    React.useEffect( () => {
        setStakeAmt("")
    }, [])

    React.useEffect(() => {
        try {
            if(!stakeAmt) return;
            setStatus({});
            setAllowanceMet(ethers.BigNumber.from(alcaStakeAllowance || 0).gt(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS)));
            if(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS).gt(ethers.utils.parseUnits(alcaBalance || "0", DECIMALS))) {
                setStatus({ 
                    error: true, 
                    message: "Stake amount higher than current balance"
                });
            }
        } catch (exc) {
            setStatus({ 
                error: true, 
                message: "There was a problem with your input, please verify" 
            });
        }
    // eslint-disable-next-line
    }, [stakeAmt]);

    const approveStaking = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)

            const tx = await ethAdapter.sendStakingAllowanceRequest();
            await tx.wait();

            setWaiting(false);
            dispatch(APPLICATION_ACTIONS.updateBalances());
            setStatus({ 
                error: false, 
                message: "Allowance granted to the Staking Contract, you can now stake ALCA" 
            });
            setHash(tx?.hash);
        } catch (exc) {
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: "There was a problem with your request, please verify or try again later" 
            });
        }
    }

    const stake = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)

            const tx = await ethAdapter.openStakingPosition(stakeAmt);
            const rec = await tx.wait();

            if (rec.transactionHash) {
                console.log("hit 1");
                await dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
                console.log("hit 2");
                setStatus({ error: false, message: "Stake completed" });
                setHash(rec.transactionHash);
                // setStakeAmt(""); // Was resetting a UI element to the user
                setWaiting(false);
            }
        } catch (exc) {
            console.log('uhoh')
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: "There was a problem with your request, please verify or try again later" 
            });
        }
    }

    const UnlockHeader = () => {
        if(!status?.message || status.error) {
            return (
                <Header>Locked Positions
                    <Header.Subheader>
                        You currently have {`${lockedAlca}`}  ALCA on Lockup
                    </Header.Subheader>
                </Header>
            )
        } else {
            return (
                <Header>
                    {status?.message}
                    <div className="mt-4 mb-4 text-base">
                        You have successfully locked {Number(stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })} ALCA
                    </div>
                    <Header.Subheader>
                        You can check the transaction hash below {hash}
                    </Header.Subheader>
                </Header>
            )
        }
    }

    return (
        <Grid padded>
            <Grid.Column width={16}>
                <UnlockHeader/>
            </Grid.Column>

            <Grid.Column width={16}>
                {(!status?.message || status.error) && (
                    <>
                        <div>
                            <Header as="h1">{stakedAlca} ALCA Staked and Locked</Header>
                            <div className="mt4">
                                {`You can unlock your position at anytime, however to receive the lock-up bonus rewards it must not be unlocked until ${unlockDate}`}
                            </div>
                        </div>
                        <div>
                            <Button
                                className="mt-4"
                                color="pink"
                                content={
                                    "Unlock Positions"
                                }
                                onClick={allowanceMet ? stake : approveStaking}
                                disabled={!stakeAmt || status?.error}
                                loading={waiting}
                            />      
                        </div>
                    </>
                )}
                {status?.message && !status?.error && 
                    <div>
                        <Button
                            className="mt-4"
                            content={"View on Etherscan"}
                            color="black"
                            onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                        />
                    </div>
                }
            </Grid.Column>
        </Grid>
    )
}