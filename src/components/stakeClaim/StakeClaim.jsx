import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Header, Button, Icon } from "semantic-ui-react";
import utils from "utils";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function StakeClaim() {
    const dispatch = useDispatch();

    const { ethRewards } = useSelector(state => ({
        ethRewards: state.application.stakedPosition.ethRewards,
    }))

    const [success, setSuccessStatus] = React.useState(false);
    const [txHash, setTxHash] = React.useState('22630ed1-95827720he230e00f5950¢45954-72');

    const claimRewards = () => (
        <>
            <Grid.Column width={16}>
                <Header>Claim Rewards
                    <Header.Subheader>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua.
                    </Header.Subheader>
                </Header>
            </Grid.Column>

            <Grid.Column width={16}>
                <div>
                    <Header as="h2">{ethRewards} ETH</Header>
                    <p>Rewards will be sent automatically to your wallet</p>
                </div>

                <div>
                    <Button
                        className="mt-4"
                        color="black"
                        content={"Claim Rewards"}
                        onClick={() => setSuccessStatus(!success)}
                        disabled={false}
                        loading={false}
                    />
                </div>
            </Grid.Column>
        </>
    )

    const claimedRewardsSuccessfully = () => (
        <>
            <Grid.Column width={16}>
                <Header>Reward Claimed Completed
                    <Header.Subheader>
                        <strong>You have successfully claiming a reward of {ethRewards} ETH</strong> 
                        Rewards will be sent automatically to your wallet
                    </Header.Subheader>
                </Header>
            </Grid.Column>

            <Grid.Column width={16}>
                <div>
                    <p>You can check the transaction hash below</p>
                    <p>
                        {txHash}
                        <Icon
                            name="copy"
                            className="cursor-pointer"
                            onClick={() => utils.string.copyText(txHash)}
                        />
                    </p>
                </div>

                <div>
                    <Button
                        className="mt-4"
                        color="black"
                        content={"View on Etherscan"}
                        onClick={() => window.open(`${ETHERSCAN_URL}${txHash}`, '_blank').focus()}
                    />
                </div>
            </Grid.Column>
        </>
    )

    return (
        <Grid>
            {success ? claimedRewardsSuccessfully() : claimRewards()}
        </Grid>
    )
}
