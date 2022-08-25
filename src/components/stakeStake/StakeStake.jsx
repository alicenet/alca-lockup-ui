
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Input, Button } from 'semantic-ui-react'
import { classNames } from "utils/generic";

export function StakeStake() {

    const { alcaBalance, alcaStakeAllowance } = useSelector(s => ({
        alcaBalance: s.application.balances.alca,
        alcaStakeAllowance: s.application.allowances.alcaStakeAllowance
    }))

    const dispatch = useDispatch();
    const [stakeAmt, setStakeAmt] = React.useState();
    const [waiting, setWaiting] = React.useState(false);

    const allowanceMet = ethers.BigNumber.from(alcaStakeAllowance || 0).gt(ethers.BigNumber.from(stakeAmt || 0));

    const approveStaking = async () => {
        setWaiting(true)
        let tx = await ethAdapter.sendStakingAllowanceRequest();
        let rec = await tx.wait();
        setWaiting(false)
        dispatch(APPLICATION_ACTIONS.updateBalances())
    }

    const stake = async () => {
        setWaiting(true)
        let tx = await ethAdapter.openStakingPosition(stakeAmt);
        let rec = await tx.wait();
        setWaiting(false)
        dispatch(APPLICATION_ACTIONS.updateBalances())
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
                        disabled={!stakeAmt}
                        loading={waiting}
                    />
                </div>

                <div className={classNames("text-xs mt-8", { hidden: allowanceMet })}>
                    *Prior to your first staked position you will be asked to approve the Staking Contract a large amount of tokens. Wallets like metamask will allow you to change this amount, and you are more than welcome to, however additional approval transactions will cost more in gas.
                </div>

            </Grid.Column>

        </Grid>
    )

}