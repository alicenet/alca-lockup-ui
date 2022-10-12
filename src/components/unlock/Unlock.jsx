import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header,  Button, Icon, Message, Segment } from "semantic-ui-react";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Unlock() {

    const { stakedAlca, lockedAlca, unlockDate } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        unlockDate: state.application.lockedPosition.unlockDate,
    }))

    const dispatch = useDispatch();
    
    const [status, setStatus] = React.useState({});
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [waiting, setWaiting] = React.useState(false);
    const [hash, setHash] = React.useState("");

    const unlockPosition = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            toggleConfirmModal(false);

            const tx = await ethAdapter.lockupStakedPosition(3);
            const rec = await tx.wait();
            if (rec.transactionHash) {
                setStatus({ error: false, message: "Lockup Successful!" });
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

    const unlockHeader = () => {
        if(!status?.message || status.error) {
            return (
                <Header>
                    Current lockup position
                    <Header.Subheader>
                    The early exit will have a 20% penalty of earned rewards, users will get the 80% of their rewards and their original stake position.
                    </Header.Subheader>

                    <Grid> 
                        <Grid.Column width={5}>
                            <div 
                                className="cursor-pointer text-xs mt-4 underline" 
                                onClick={() => window.open(`${process.env.REACT_APP__ABOUT_EXTRA_ALCA_LOCKUP_URL}`, '_blank').focus()}
                            >
                                About extra ALCA lockup rewards
                            </div>
                        </Grid.Column>

                        <Grid.Column width={5}>
                            <div 
                                className="cursor-pointer text-xs mt-4 underline" 
                                onClick={() => window.open(`${process.env.REACT_APP__ABOUT_ETH_LOCKUP_URL}`, '_blank').focus()}
                            >
                                About ETH % lockup rewards
                            </div>
                        </Grid.Column>
                    </Grid>
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

    const confirmation = () => (
        <ConfirmationModal 
            title="Unlock this position"
            open={openConfirmation}
            onClose={() => toggleConfirmModal(false)}
            onOpen={() => console.log('openned')}
            onAccept={() => unlockPosition()}
        >
            <Message warning>
                <Message.Header>You are about unlock this 500 ALCA position and lose potential rewards</Message.Header>
                <p>The early exit will have a 20% penalty for earned rewards, users will get the 80%<br />
                    of their rewards and their original stake position.</p>
            </Message>

            <p>You are about to unlock this 500 ALCA before the lock-up period this means....</p>

            <Header as="h3">Locked rewards as today</Header>
            
            <div className="font-bold space-x-2">
                <Icon name="ethereum"/>0.012344 ETH 

                <Icon name="ethereum"/>344 ALCA
            </div>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                <Grid.Column width={16}>{unlockHeader()}</Grid.Column>

                <Grid.Column width={16}>
                    {(!status?.message || status.error) && (
                        <>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon bordered size="huge" color="grey" name="lock" />
                                </div>
                            
                                <div>
                                    <Header as="h1">{stakedAlca} ALCA Staked Locked</Header>
                                    <p>
                                        You can unlock your position at anytime, however to receive the complete lockup bonus rewards 
                                        it must not be unlocked until {unlockDate}
                                    </p>
                                </div>
                            </div>

                            <Segment className="flex justify-between items-center">
                                <div>
                                    <Header as="h3">Locked rewards as today</Header>
                                    
                                    <div className="font-bold space-x-2">
                                        <Icon name="ethereum"/>0.012344 ETH 

                                        <Icon name="ethereum"/>344 ALCA
                                    </div>
                                </div>

                                <Button
                                    color="pink"
                                    loading={waiting}
                                    onClick={() => toggleConfirmModal(true)}
                                    content={"Unlock Positions"}
                                />      
                            </Segment>
                        </>
                    )}

                    {status?.message && !status?.error && (
                        <div>
                            <Button
                                className="mt-4"
                                content={"View on Etherscan"}
                                color="black"
                                onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                            />
                        </div>
                    )}
                </Grid.Column>
            </Grid>
        </>
    )
}