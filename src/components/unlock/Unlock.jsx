import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header,  Button, Icon, Message, Segment } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Unlock() {

    const { lockedAlca, unlockDate } = useSelector(state => ({
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
                setStatus({ error: false, message: "Unlocked Successful!" });
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

    const requestUnlock = () => (
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
                                You can unlock your position at anytime, however to receive the complete lockup bonus rewards 
                                it must not be unlocked until {unlockDate}
                            </p>
                        </div>
                    </div>

                    <Segment className="flex w-10/12 justify-between items-center rounded-2xl bg-neutral-50 border-neutral-200">
                        <div>
                            <Header as="h4">Locked rewards as today</Header>
                            
                            <div className="font-bold space-x-2">
                                <Icon name="ethereum"/>0.012344 ETH 

                                <Icon name="cog"/>344 ALCA
                            </div>
                        </div>

                        <Button
                            color="pink"
                            loading={waiting}
                            onClick={() => toggleConfirmModal(true)}
                            content={"Unlock position & rewards"}
                        />      
                    </Segment>
                </>
            )}
        </Grid.Column>
    )

    const unlockSuccessful = () => (
        <Grid.Column width={16}>
            <div className="mb-10">
                <Header as="h3">Claimed Rewards</Header>
                
                <div className="font-bold space-x-2">
                    <Icon name="ethereum"/>0.012344 ETH 

                    <Icon name="cog"/>344 ALCA
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
    )

    const unlockHeader = () => (
        <Grid.Column width={16} className="flex mb-4">
            <Grid.Row>
                <Header>
                    {status?.message || 'Current lockup position'}
                    <Header.Subheader className="mt-3">
                        {!hash 
                        ? (`The early exit will have a 20% penalty of earned rewards, users will get the 80% of their rewards and their original stake position.`)
                        : (`Your position 500 ALCA has been unlocked`)}
                    </Header.Subheader>
                </Header>

                <Grid className="mt-3"> 
                    <div 
                        className="cursor-pointer text-sm underline" 
                        onClick={() => window.open(`${process.env.REACT_APP__ABOUT_EXTRA_ALCA_LOCKUP_URL}`, '_blank').focus()}
                    >
                        About extra ALCA lockup rewards
                    </div>

                    <div 
                        className="cursor-pointer text-sm underline" 
                        onClick={() => window.open(`${process.env.REACT_APP__ABOUT_ETH_LOCKUP_URL}`, '_blank').focus()}
                    >
                        About ETH % lockup rewards
                    </div>
                </Grid>
            </Grid.Row>
        </Grid.Column>
    )

    const confirmation = () => (
        <ConfirmationModal 
            title="Unlock this position"
            open={openConfirmation}
            onClose={() => toggleConfirmModal(false)}
            onOpen={() => console.log('openned')}
            actionLabel="Unlock This Position"
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

                <Icon name="cog"/>344 ALCA
            </div>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                {unlockHeader()}
                {status?.message ? unlockSuccessful() : requestUnlock()}

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