import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { APPLICATION_ACTION_TYPES, TOKEN_TYPES } from "redux/constants";
import { Grid, Header, Button, Icon, Message, Segment } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Unlock() {
    const { lockedAlca, tokenId, ethReward, alcaReward, lockedPosition } = useSelector(state => ({
        lockedPosition: state.application.lockedPosition,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        tokenId: state.application.lockedPosition.tokenId,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward
    }))

    const dispatch = useDispatch();

    const [waiting, setWaiting] = React.useState(false);
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [claimedEth, setClaimedEth] = React.useState(0);
    const [claimedAlca, setClaimedAlca] = React.useState(0);
    const [hash, setHash] = React.useState("");

    const claimRewards = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true);
            toggleConfirmModal(false);

            const tx = await ethAdapter.sendExitLock(tokenId);
            if (tx.error) throw tx.error;
            const rec = await tx.wait();

            if (rec.transactionHash) {
                setStatus({ error: false, message: "Rewards Claimed Successful!" });
                setHash(rec.transactionHash);
                setWaiting(false);
                setClaimedEth(ethReward);
                setClaimedAlca(alcaReward);
                dispatch({type: APPLICATION_ACTION_TYPES.SET_LOCKED_POSITION, payload: { ...lockedPosition, lockedAlca: 0 }})
                dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
            }
        } catch (exception) {
            setStatus({ 
                error: true, 
                message: exception.toString() || "There was a problem with your request, please verify or try again later" 
            });
            setWaiting(false);
        }
    }

    const requestRewards = () => (
        <Grid.Column width={16}>
            {(!status?.message || status.error) && (
                <>
                    <div className="flex mb-16">
                        <div className="flex justify-center items-center mr-3 p-6 h-20 bg-neutral-300">
                            <Icon size="large" name="star" className="mr-0" />
                        </div>
                    
                        <div>
                            <Header as="h1" className="mb-0">{lockedAlca} ALCA Staked Locked</Header>
                            <p>You are now able to claim your lockup rewards, Claim now!</p>
                        </div>
                    </div>

                    <Segment className="flex justify-between items-center rounded-2xl bg-teal-50 border-teal-200">
                        <div>
                            <Header as="h4" color="teal">Unlocked rewards as of today</Header>
                            
                            <div className="font-bold space-x-2">
                                <Icon name="ethereum"/>{ethReward} ETH 

                                <Icon name="cog"/>{alcaReward} ALCA
                            </div>
                        </div>

                        <Button
                            color="teal"
                            loading={waiting}
                            onClick={() => toggleConfirmModal(true)}
                            content={"Claim Rewards"}
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
                {hash ? 'Rewards Claimed Successful!' : 'Claim unlocked position rewards'}
                <Header.Subheader className="mt-3">
                    {hash 
                        ? (`The following rewards have been sent to your wallet`)
                        : (`Your ${lockedAlca} ALCA position is unlocked and ready to be claimed`)}
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