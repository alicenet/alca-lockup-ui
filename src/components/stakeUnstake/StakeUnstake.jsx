import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import ethAdapter from "eth/ethAdapter";
import { Grid, Header, Button, Icon } from "semantic-ui-react";
import utils from "utils";

export function StakeUnstake() {
    const dispatch = useDispatch();
    const [waiting, setWaiting] = React.useState(false);
    const [success, setSuccessStatus] = React.useState(false);
    const [txHash, setTxHash] = React.useState('');
    const [untakedAmount, setUnstakedAmount] = React.useState('');
    const [claimedRewards, setClaimedRewards] = React.useState('');

    const { stakedAlca, tokenId, ethRewards } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        tokenId: state.application.stakedPosition.tokenId,
        ethRewards: state.application.stakedPosition.ethRewards,
    }))

    const unstakePosition = async () => {
        setWaiting(true);
        const tx = await ethAdapter.unstakingPosition(tokenId);
        const rec = tx.hash && await tx.wait();

        setWaiting(false);
        if(rec.transactionHash) {
            setSuccessStatus(true);
            setUnstakedAmount(stakedAlca);
            setClaimedRewards(ethRewards);
            setTxHash(rec.transactionHash);
            dispatch(APPLICATION_ACTIONS.updateBalances());
        }
    }

    const requestUnstake = () => (
        <>
            <Grid.Column width={16}>
                <Header>Unstake ALCA Position
                    <Header.Subheader>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua.
                    </Header.Subheader>
                </Header>
            </Grid.Column>

            <Grid.Column width={16}>
                <div>
                    <Header as="h2">{stakedAlca} ALCA</Header>
                    <Header as="h3">Rewards to Claim: {ethRewards} ETH</Header>
                    <p>Rewards will be sent automatically to your wallet</p>
                </div>

                <div>
                    <Button
                        className="mt-4"
                        color="black"
                        content={"Unstake Position"}
                        onClick={unstakePosition}
                        disabled={false}
                        loading={waiting}
                    />
                </div>
            </Grid.Column>
        </>
    )

    const unstakedSuccessfully = () => (
        <>
            <Grid.Column width={16}>
                <Header>Unstake completed
                    <Header.Subheader>
                        <strong>You have successfully unstaked {untakedAmount} ALCA</strong> and claimed a{' '} 
                        <strong>reward of {claimedRewards} ETH</strong> to your wallet
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
                        content={"View on Etherscan (TBD)"}
                        onClick={() => console.log('view on etherscan')}
                    />
                </div>
            </Grid.Column>
        </>
    )

    return (
        <Grid padded >
            {success ? unstakedSuccessfully() : requestUnstake()}
        </Grid>
    )
}
