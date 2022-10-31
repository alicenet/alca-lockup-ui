import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { TOKEN_TYPES, LOCKUP_PERIOD_STATUS } from "redux/constants";
import { Grid, Header, Button, Icon, Message } from "semantic-ui-react";
import utils from "utils";
import { ConfirmationModal } from "components";

const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Lockup() {

    const { stakedPosition, tokenId, lockedPosition } = useSelector(state => ({
        tokenId: state.application.stakedPosition.tokenId,
        stakedPosition: state.application.stakedPosition,
        lockedPosition: state.application.lockedPosition,
    }))

    const dispatch = useDispatch();

    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [openConfirmation, toggleConfirmModal] = React.useState(false);
    const [hash, setHash] = React.useState("");
    const lockupPeriodEnded = lockedPosition.lockupPeriod === LOCKUP_PERIOD_STATUS.END;

    const lockupPosition = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true);
            toggleConfirmModal(false);

            const tx = await ethAdapter.lockupStakedPosition(tokenId);
            if (tx.error) throw tx.error;
            const rec = await tx.wait();

            if (rec.transactionHash) {
                setHash(rec.transactionHash);
                setStatus({ error: false, message: "Lockup Successful!" });
                setWaiting(false);
                await dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
            }
        } catch (exception) {
            setStatus({ 
                error: true, 
                message: exception.toString() || "There was a problem with your request, please verify or try again later" 
            });
            setWaiting(false);
        }
    }

    const lockupStakedAmount = () => (
        <Grid.Column width={16}>
            {((!lockedPosition.lockedAlca || !hash) || status.error) && (
                <>
                    <div>
                        <Header as="h2">{stakedPosition.stakedAlca} ALCA Staked</Header>
                    </div>

                    <div>
                        <Button
                            className="mt-4"
                            color="black"
                            content={"Lockup Positions"}
                            onClick={() => toggleConfirmModal(true)}
                            disabled={stakedPosition.stakedAlca === 0 || lockupPeriodEnded}
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
                        {lockedPosition.lockedAlca && hash ? 'Lockup Successful!' : 'Lockup Staked Positions'}
                        <Header.Subheader className="mt-3">
                            {(!lockedPosition.lockedAlca) 
                            ? (`You currently have a staked position of ${stakedPosition.stakedAlca} ALCA, a lockup will be a period of 6 months with 5X multiplayer (TBD)`) 
                            : (`You have Locked-up ${lockedPosition.lockedAlca} ALCA for 6 months 5X multiplayer (TBD)`)}
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
            actionLabel="Lockup Position"
            onAccept={() => lockupPosition()}
        >
            <p>You are about to Lock-up <strong>{stakedPosition.stakedAlca}</strong> ALCA for 6 months with a 5X multiplayer (TBD)</p>
        </ConfirmationModal>
    )

    return (
        <>
            {confirmation()}

            <Grid padded>
                {lockupHeader()}
                {lockupPeriodEnded && (
                    <Grid.Column width={16}>
                        <Message warning><p>{'Lockup is not available outside the lockup period'}</p></Message>
                    </Grid.Column>
                )}
                {lockedPosition.lockedAlca && hash ? lockupSuccessful() : lockupStakedAmount()}

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