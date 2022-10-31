import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { TOKEN_TYPES, LOCKUP_PERIOD_STATUS } from "redux/constants";
import { Grid, Header, Button, Icon, Message, Segment } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function LockupClaim() {
    const { lockedAlca, tokenId, ethReward, alcaReward, lockupPeriod, penalty, remainingRewards } = useSelector(state => ({
        lockedAlca: state.application.lockedPosition.lockedAlca,
        tokenId: state.application.lockedPosition.tokenId,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward,
        lockupPeriod: state.application.lockedPosition.lockupPeriod,
        penalty: state.application.lockedPosition.penalty,
        remainingRewards: state.application.lockedPosition.remainingRewards
    }))

    const dispatch = useDispatch();

    const [waiting, setWaiting] = React.useState(false);
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [claimedEth, setClaimedEth] = React.useState(0);
    const [claimedAlca, setClaimedAlca] = React.useState(0);
    const [hash, setHash] = React.useState("");
    const lockupPeriodEnded = lockupPeriod === LOCKUP_PERIOD_STATUS.END;

    const claimRewards = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            toggleConfirmModal(false);

            const tx = await ethAdapter.collectAllProfits(tokenId);
            if (tx.error) throw tx.error;
            const rec = await tx.wait();

            if (rec.transactionHash) {
                setStatus({ error: false, message: "Rewards Claimed Successfully!" });
                setHash(rec.transactionHash);
                setWaiting(false);
                setClaimedEth(ethReward);
                setClaimedAlca(alcaReward);
                await dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
            }
        } catch (exception) {
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: exception.toString() || "There was a problem with your request, please verify or try again later" 
            });
        }
    }

    const requestRewards = () => (
        <Grid.Column width={16}>
            {(!status?.message || status.error) && (
                <>
                    <div className="flex mb-16">
                        <div className="flex justify-center items-center mr-3 p-6 h-20 bg-neutral-300">
                            <Icon size="large" name="lock" className="mr-0" />
                        </div>
                    
                        <div>
                            <Header as="h1" className="mb-0">{lockedAlca} ALCA Staked Locked</Header>
                            <p>
                                You can claim your rewards at anytime, however early claiming will have a {penalty}% penalty of earned rewards, 
                                users will get the {remainingRewards}% of their rewards and their original staked position's ALCA.
                            </p>
                        </div>
                    </div>

                    <Segment className="flex justify-between items-center rounded-2xl bg-neutral-50 border-neutral-200">
                        <div>
                            <Header as="h4">Locked rewards as of today</Header>
                            
                            <div className="font-bold space-x-2">
                                <Icon name="ethereum"/>{ethReward} ETH 

                                <Icon name="cog"/>{alcaReward} ALCA
                            </div>
                        </div>

                        <Button
                            color="blue"
                            loading={waiting}
                            disabled={['0.0', 0].includes(ethReward) && ['0.0', 0].includes(alcaReward)}
                            onClick={() => toggleConfirmModal(true)}
                            content={"Claim rewards"}
                        />      
                    </Segment>
                </>
            )}
        </Grid.Column>
    )

    const claimSuccessful = () => (
        <Grid.Column width={16}>
            <div className="mb-10">
                <Header as="h3">Claimed Rewards</Header>
                
                <div className="font-bold space-x-2">
                    <Icon name="ethereum"/>{claimedEth} ETH 

                    <Icon name="cog"/>{claimedAlca} ALCA
                </div>
            </div>

            <Header.Subheader>
                You can check the transaction hash below {hash}
                <Icon
                    name="copy"
                    className="cursor-pointer ml-1"
                    onClick={() => utils.string.copyText(hash)}
                />
            </Header.Subheader>

            {status?.message && !status?.error && (
                <Button
                    className="mt-4"
                    content={"View on Etherscan"}
                    color="black"
                    onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                />
            )}
        </Grid.Column>
    )

    const claimHeader = () => (
        <Grid.Column width={16} className="flex mb-4">
            <Header>
                {hash ? 'Rewards Claimed Successfully!' : 'Claim Lockup Rewards'}
                <Header.Subheader className="mt-3">
                    {hash 
                        ? (`You have claimed your lockup rewards`) 
                        : (`Lockup rewards can be claimed without unlocking your position.`)}
                </Header.Subheader>
            </Header>
        </Grid.Column>
    )

    const confirmation = () => (
        <ConfirmationModal 
            title="Claim Reward"
            open={openConfirmation}
            onClose={() => toggleConfirmModal(false)}
            actionLabel="Claim Rewards"
            onAccept={() => claimRewards()}
        >
            {!lockupPeriodEnded && (
                <Message warning>
                    <Message.Header>You are about to claim rewards for this locked position and lose potential rewards</Message.Header>
                    <p>The early exit will have a {penalty}% penalty for earned rewards, users will get the {remainingRewards}%<br />
                        of their rewards and their original staked position's ALCA.</p>
                </Message>
            )}

            <p>You are about to claim the following rewards. These funds will be send to your wallet.</p>

            <div className="font-bold space-x-2">
                <Icon name="ethereum"/>{ethReward} ETH 

                <Icon name="cog"/>{alcaReward} ALCA
            </div>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                {claimHeader()}
                {hash ? claimSuccessful() : requestRewards()}

                {status.error && (
                    <Grid.Column width={16}>
                        <Message negative>
                            <p>{status.message}</p>
                        </Message>
                    </Grid.Column>
                )}
            </Grid>
        </>
    )
}