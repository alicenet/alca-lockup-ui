import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { APPLICATION_ACTION_TYPES, TOKEN_TYPES } from "redux/constants";
import { Grid, Header,  Button, Icon, Message, Segment } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function UnlockEarly() {

    const { lockedAlca, ethReward, alcaReward, unlockDate, penalty, remainingRewards, lockedPosition } = useSelector(state => ({
        lockedPosition: state.application.lockedPosition,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward,
        unlockDate: state.application.lockedPosition.unlockDate,
        penalty: state.application.lockedPosition.penalty,
        remainingRewards: state.application.lockedPosition.remainingRewards
    }))

    const dispatch = useDispatch();
    
    const [status, setStatus] = React.useState({});
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [waiting, setWaiting] = React.useState(false);
    const [unlockedPosition, setUnlockedPosition] = React.useState(0);
    const [claimedEth, setClaimedEth] = React.useState(0);
    const [claimedAlca, setClaimedAlca] = React.useState(0);
    const [hash, setHash] = React.useState("");

    const unlockPosition = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            toggleConfirmModal(false);

            const tx = await ethAdapter.sendEarlyExit(lockedAlca);
            if (tx.error) throw tx.error;
            const rec = await tx.wait();

            if (rec.transactionHash) {
                setHash(rec.transactionHash);
                setStatus({ error: false, message: "Unlocked Successful!" });
                setWaiting(false);
                setUnlockedPosition(lockedAlca);
                setClaimedEth(ethReward);
                setClaimedAlca(alcaReward);
                dispatch({type: APPLICATION_ACTION_TYPES.SET_LOCKED_POSITION, payload: { ...lockedPosition, lockedAlca: 0 }})
                dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
            }
        } catch (exception) {
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: exception.toString() || "There was a problem with your request, please verify or try again later" 
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
                                it must not be unlocked until {`${unlockDate} ${unlockDate === 1 ? 'block' : 'blocks'}`} 
                            </p>
                        </div>
                    </div>

                    <Segment className="flex justify-between items-center rounded-2xl bg-neutral-50 border-neutral-200">
                        <div>
                            <Header as="h4">Locked rewards as today</Header>
                            
                            <div className="font-bold space-x-2">
                                <Icon name="ethereum"/>{ethReward} ETH 

                                <Icon name="cog"/>{alcaReward} ALCA
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
                    {hash ? 'Unlocked Successful!' : 'Current lockup position'}
                    <Header.Subheader className="mt-3">
                        {!hash 
                        ? (`The early exit will have a ${penalty}% penalty of earned rewards, users will get the ${remainingRewards}% of their rewards and their original staked position's ALCA.`)
                        : (`Your position ${unlockedPosition} ALCA has been unlocked`)}
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
            actionLabel="Unlock This Position"
            onAccept={() => unlockPosition()}
        >
            <Message warning>
                <Message.Header>You are about to unlock this {lockedAlca} ALCA position and lose potential rewards</Message.Header>
                <p>The early exit will have a {penalty}% penalty for earned rewards, users will get the {remainingRewards}%<br />
                    of their rewards and their original staked position's ALCA.</p>
            </Message>

            <p>You are about to unlock this {lockedAlca} ALCA before the lock-up period this means.... (TBD)</p>

            <Header as="h3">Locked rewards as of today</Header>
            
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
                {unlockHeader()}
                {hash ? unlockSuccessful() : requestUnlock()}

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