import React from "react";
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Input, Button } from "semantic-ui-react";
import { classNames } from "utils/generic";

const DECIMALS = 18;
const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function StakeStake() {

    const { alcaBalance, alcaStakeAllowance } = useSelector(state => ({
        alcaBalance: state.application.balances.alca,
        alcaStakeAllowance: state.application.allowances.alcaStakeAllowance
    }))

    const dispatch = useDispatch();
    const [stakeAmt, setStakeAmt] = React.useState("");
    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [allowanceMet, setAllowanceMet] = React.useState(false);
    const [hash, setHash] = React.useState("");

    React.useEffect(() => {
        try {
            if(!stakeAmt) return;
            setStatus({});
            setAllowanceMet(ethers.BigNumber.from(alcaStakeAllowance || 0).gt(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS)));
            if(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS).gt(ethers.utils.parseUnits(alcaBalance || "0", DECIMALS))){
                setStatus({error: true, message: "Stake amount higher than current balance"});
            }
        } catch (exc) {
            setStatus({error: true, message: "There was a problem with your input, please verify"});
        }
    // eslint-disable-next-line
    }, [stakeAmt]);

    const approveStaking = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            let tx = await ethAdapter.sendStakingAllowanceRequest();
            await tx.wait();
            setWaiting(false);
            dispatch(APPLICATION_ACTIONS.updateBalances());
            setStatus({error: false, message: "Allowance granted to the Staking Contract, you can now stake ALCA"});
            setHash(tx?.hash);
        } catch (exc) {
            setWaiting(false);
            setStatus({error: true, message: "There was a problem with your request, please verify or try again later"});
        }
    }

    const stake = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            let tx = await ethAdapter.openStakingPosition(stakeAmt);
            await tx.wait();
            setWaiting(false);
            dispatch(APPLICATION_ACTIONS.updateBalances());
            setStatus({error: false, message: "Stake completed"});
            setHash(tx?.hash);
        } catch (exc) {
            setWaiting(false);
            setStatus({error: true, message: "There was a problem with your request, please verify or try again later"});
        }
    }

    const StakingHeader = () => {
        if(!status?.message || status.error){
            return (
                <Header>Stake your ALCA
                    <Header.Subheader>
                        {alcaBalance} available for staking
                    </Header.Subheader>
                </Header>)
        } else {
            return (
                <Header>
                    {status?.message}
                    <div className="mt-4 mb-4 text-base">
                        You have staked {stakeAmt} ALCA, there are {alcaBalance} available for staking
                    </div>
                    <Header.Subheader>
                        You can check the transaction hash below {hash}
                    </Header.Subheader>
                </Header>)
        }
    }

    const StakingInput = () => {
        if(!status?.message || status.error){
            return (<>
                        <div>
                            <Input
                                placeholder="Amount to stake"
                                value={stakeAmt}
                                onChange={e => setStakeAmt(e.target.value)}
                                action={{
                                    content: "Max",
                                    onClick: () => { setStakeAmt(alcaBalance) }
                                }}
                            />
                        </div>

                        <div>
                            <Button
                                className="mt-4"
                                content={(!alcaStakeAllowance || !stakeAmt) ? "Enter an amount" : allowanceMet ? "Stake ALCA" : "Allow ALCA*"}
                                onClick={allowanceMet ? stake : approveStaking}
                                disabled={!stakeAmt || status?.error}
                                loading={waiting}
                            />
                        </div>
                </>)
        } else {
            return <></>;
        }
    }

    return (
        <Grid padded >

            <Grid.Column width={16}>

                <StakingHeader/>

            </Grid.Column>


            <Grid.Column width={16}>

                <StakingInput/>

                <div className={classNames("text-xs mt-8", { hidden: allowanceMet })}>
                    *Prior to your first staked position you will be asked to approve the Staking Contract a large amount of tokens. Wallets like metamask will allow you to change this amount, and you are more than welcome to, however additional approval transactions will cost more in gas.
                </div>

                {status?.message && !status?.error && 
                    <div>
                        <Button
                            className="mt-4"
                            content={"View on Etherscan"}
                            onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                        />
                    </div>
                }

            </Grid.Column>

        </Grid>
    )

}