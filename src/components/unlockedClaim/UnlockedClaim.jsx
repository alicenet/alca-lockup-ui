import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Button, Icon, Segment } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function UnlockedClaim() {
    const { stakedAlca, lockedAlca, ethReward, alcaReward } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward
    }))

    const dispatch = useDispatch();

    const [waiting, setWaiting] = React.useState(false);
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [hash, setHash] = React.useState("");

    const claimRewards = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            toggleConfirmModal(false);

            const tx = await ethAdapter.lockupStakedPosition(3);
            const rec = await tx.wait();
            if (rec.transactionHash) {
                setStatus({ error: false, message: "Rewards Claimed Successful!" });
                setHash(rec.transactionHash);
                dispatch(APPLICATION_ACTIONS.updateBalances());
                setWaiting(false);
            }
        } catch (exc) {
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: "There was a problem with your request, please verify or try again later" 
            });
        }
    }

    const claimHeader = () => {
        if(!status?.message || status.error) {
            return (
                <Header>
                    Claim unlocked position rewards
                    <Header.Subheader className="mt-3">
                        Your 500 ALCA position is unlocked and ready to be claimed
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
                        <Icon
                            name="copy"
                            className="cursor-pointer ml-1"
                            onClick={() => utils.string.copyText(hash)}
                        />
                    </Header.Subheader>
                </Header>
            )
        }
    }

    const confirmation = () => (
        <ConfirmationModal 
            title="Claim Reward"
            open={openConfirmation}
            onClose={() => toggleConfirmModal(false)}
            onOpen={() => console.log('openned')}
            actionLabel="Claim Rewards"
            onAccept={() => claimRewards()}
        >
            <p>You are about to claim the following rewards. This funds will be send to your wallet.</p>

            <div className="font-bold space-x-2">
                <Icon name="ethereum"/>0.012344 ETH 
                <Icon name="cog"/>344 ALCA
            </div>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                <Grid.Column width={16} className="flex mb-4">{claimHeader()}</Grid.Column>

                <Grid.Column width={16}>
                    {(!status?.message || status.error) && (
                        <>
                            <div className="flex mb-16">
                                <div className="flex justify-center items-center mr-3 p-6 h-20 bg-neutral-300">
                                    <Icon size="large" name="star" className="mr-0" />
                                </div>
                            
                                <div>
                                    <Header as="h1" className="mb-0">{stakedAlca} ALCA Staked Locked</Header>
                                    <p>You are now able to claim your lockup rewards, Claim now!</p>
                                </div>
                            </div>

                            <Segment className="flex w-9/12 justify-between items-center rounded-2xl bg-teal-50 border-teal-200">
                                <div>
                                    <Header as="h4" color="teal">Unlocked rewards as of today</Header>
                                    
                                    <div className="font-bold space-x-2">
                                        <Icon name="ethereum"/>0.012344 ETH 

                                        <Icon name="cog"/>344 ALCA
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

                    {status?.message && !status?.error && (
                        <Button
                            className="mt-4"
                            content={"View on Etherscan"}
                            color="black"
                            onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                        />
                    )}
                </Grid.Column>
            </Grid>
        </>
    )
}