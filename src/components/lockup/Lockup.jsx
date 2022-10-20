import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Button, Icon, Message } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Lockup() {

    const { stakedPosition, tokenID, lockedPosition } = useSelector(state => ({
        tokenID: state.application.stakedPosition.tokenId,
        stakedPosition: state.application.stakedPosition,
        lockedPosition: state.application.lockedPosition,
    }))

    const dispatch = useDispatch();

    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [hash, setHash] = React.useState("");

    const lockupPosition = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true);

            const tx = await ethAdapter.safeTranferToLockup(tokenID);
            await tx.wait();

            if (tx?.hash) {
                dispatch(APPLICATION_ACTIONS.updateBalances());
                setStatus({ 
                    error: false, 
                    message: "Approval granted to the lockup contract, you can now lockup your Staked ALCA" 
                });
                setHash(tx?.hash);
                setWaiting(false);
            }

        } catch (exc) {
            setStatus({ 
                error: true, 
                message: "There was a problem with your request, please verify or try again later" 
            });
            setWaiting(false);
        }
    }

    const lockupStakedAmount = () => (
        <Grid.Column width={16}>
            {((!lockedPosition.lockedAlca) || status.error) && (
                <>
                    <div>
                        <Header as="h2">{stakedPosition.stakedAlca} ALCA Staked</Header>
                    </div>

                    <div>
                        <Button
                            className="mt-4"
                            color="black"
                            content={"Lockup Positions"}
                            onClick={() => {
                                toggleConfirmModal(true);
                                lockupPosition(); 
                            }}
                            disabled={stakedPosition.stakedAlca === 0 || status?.error }
                            loading={waiting}
                        />      
                    </div>
                </>
            )}
        </Grid.Column>
    )

    const lockupSuccessful = () => (
        <Grid.Column width={16}>
            <Header.Subheader>
                You can check the transaction hash below {hash}
                <Icon
                    name="copy"
                    className="cursor-pointer ml-1"
                    onClick={() => utils.string.copyText(hash)}
                />
            </Header.Subheader>

            {status?.message && (!status?.error && lockedPosition.lockedAlca > 0) && (
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
    
    const lockupHeader = () => (
        <>
            <Grid.Column width={16} className="mb-10">
                <Grid.Row>
                    <Header>
                        {status?.message || 'Lockup Staked Positions'}
                        <Header.Subheader className="mt-3">
                            {(!lockedPosition.lockedAlca) 
                            ? (`You currently have a staked position of ${Number(stakedPosition.stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })} ALCA, a lockup will be a period of 6 months with 5X multiplayer`) 
                            : (`You have Locked-up ${Number(stakedPosition.stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })}  ALCA for 6 months 5X multiplayer`)}
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
        </>
    )

    const confirmation = () => (
        <ConfirmationModal 
            title="Lockup this staked position"
            open={openConfirmation}
            onClose={() => toggleConfirmModal(false)}
            onOpen={() => console.log('openned')}
            actionLabel="Lockup Position"
            onAccept={() => toggleConfirmModal(false)}
        >
            <p>You are about to Lock-up <strong>{stakedPosition.stakedAlca}</strong> ALCA for 6 months with a XX multiplayer</p>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                {lockupHeader()}
                {lockedPosition.lockedAlca ? lockupSuccessful() : lockupStakedAmount()}

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