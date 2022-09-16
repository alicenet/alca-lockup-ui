import React from "react";
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Input, Button } from "semantic-ui-react";
import { classNames } from "utils/generic";
import { CONTRACT_ADDRESSES } from "config/contracts";

const DECIMALS = 18;
const ETHERSCAN_URL = "https://etherscan.io/address/";

export function StakeStake() {

    const { alcaBalance, alcaStakeAllowance } = useSelector(s => ({
        alcaBalance: s.application.balances.alca,
        alcaStakeAllowance: s.application.allowances.alcaStakeAllowance
    }))

    const dispatch = useDispatch();
    const [stakeAmt, setStakeAmt] = React.useState();
    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [allowanceMet, setAllowanceMet] = React.useState(false);

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
            setStatus({});
            setWaiting(true)
            let tx = await ethAdapter.sendStakingAllowanceRequest();
            await tx.wait();
            setWaiting(false);
            dispatch(APPLICATION_ACTIONS.updateBalances());
            setStatus({error: false, message: "Stake request sent!"});
        } catch (exc) {
            setWaiting(false);
            setStatus({error: true, message: "There was a problem with your request, please verify or try again later"});
        }
    }

    const stake = async () => {
        try {
            setStatus({});
            setWaiting(true)
            let tx = await ethAdapter.openStakingPosition(stakeAmt);
            await tx.wait();
            setWaiting(false);
            dispatch(APPLICATION_ACTIONS.updateBalances());
            setStatus({error: false, message: "Approve staking sent!"});
        } catch (exc) {
            setWaiting(false);
            setStatus({error: true, message: "There was a problem with your request, please verify or try again later"});
        }
    }

    return (
        <Grid padded >

            <Grid.Column width={16}>

                <Header>Stake your ALCA
                    <Header.Subheader>
                        {alcaBalance} available for staking
                    </Header.Subheader>
                </Header>

            </Grid.Column>


            <Grid.Column width={16}>

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

                <div className={classNames("text-xs mt-8")}>
                    {status?.message}
                </div>

                <div className={classNames("text-xs mt-8", { hidden: allowanceMet })}>
                    *Prior to your first staked position you will be asked to approve the Staking Contract a large amount of tokens. Wallets like metamask will allow you to change this amount, and you are more than welcome to, however additional approval transactions will cost more in gas.
                </div>

                {status?.message && !status?.error && 
                    <div>
                        <Button
                            className="mt-4"
                            content={"Open in Etherscan"}
                            onClick={() => window.open(`${ETHERSCAN_URL}${CONTRACT_ADDRESSES.PublicStaking}`, '_blank').focus()}
                        />
                    </div>
                }

            </Grid.Column>

        </Grid>
    )

}