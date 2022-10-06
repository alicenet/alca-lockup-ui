import React from "react";
import ethAdapter from "eth/ethAdapter";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Button } from "semantic-ui-react";
import { APPLICATION_ACTION_TYPES, TOKEN_TYPES } from "redux/constants";
import { setLockedPosition } from "redux/actions/application";

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
    const [approvedLockup, setApprovedLockup] = React.useState(0);
    const [hash, setHash] = React.useState("");
    
    

    const approveLockup = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            const tx = await ethAdapter.sendLockupApproval(tokenID);
            await tx.wait();

            setWaiting(false);
            if(process.env.REACT_APP__MODE === "TESTING"){
                console.log(process.env.REACT_APP__MODE)
                
            } else {
                dispatch(APPLICATION_ACTIONS.updateBalances());
            }
            setStatus({ 
                error: false, 
                message: "Approval granted to the lockup contract, you can now lockup your Staked ALCA" 
            });
            setHash(tx?.hash);
            setApprovedLockup(true);
        } catch (exc) {
            setWaiting(false);
            setStatus({ 
                error: true, 
                message: "There was a problem with your request, please verify or try again later" 
            });
            setApprovedLockup(false);
        }
    }

    const lockupPosition = async () => {
        try {
            setHash("");
            setStatus({});
            setWaiting(true)
            const tx = await ethAdapter.lockupStakedPosition(tokenID);
            const rec = await tx.wait();
            if (rec.transactionHash) {
                if (process.env.REACT_APP__MODE !== "TESTING"){
                    await dispatch(APPLICATION_ACTIONS.updateBalances(TOKEN_TYPES.ALL));
                }
                setStatus({ error: false, message: "Lockup Successful!" });
                setHash(rec.transactionHash);
                const tokenId = Array.isArray(stakedPosition.tokenID) ? stakedPosition.tokenID[0] : stakedPosition.tokenID
                
                dispatch(APPLICATION_ACTIONS.setLockedPosition(stakedPosition.stakedAlca, tokenId, 0,0));
                
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
    
    const LockupHeader = () => {
        if(!status?.message || status.error || (!lockedPosition.lockedAlca && !approvedLockup)) {
            return (
                <Header>Lockup Staked Positions
                    <Header.Subheader>
                        You currently have {Number(stakedPosition.stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })}  ALCA staked, the lockup period is 6 months
                    </Header.Subheader>
                        <Grid> 
                            <Grid.Column width={5}>
                                <div className="cursor-pointer text-xs mt-4 underline" onClick={() => window.open(`${process.env.REACT_APP__ABOUT_EXTRA_ALCA_LOCKUP_URL}`, '_blank').focus()}>About extra ALCA lockup rewards</div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                            <div className="cursor-pointer text-xs mt-4 underline" onClick={() => window.open(`${process.env.REACT_APP__ABOUT_ETH_LOCKUP_URL}`, '_blank').focus()}>About ETH % lockup rewards</div>
                            </Grid.Column>
                        </Grid>
                </Header>
            )
        } 
        
        else if(!status.error && !lockedPosition.lockedAlca && approvedLockup){
            return (
                <Header>Lockup Staked Positions
                    <Header.Subheader>
                    {status?.message}, the lockup period is 6 months
                    </Header.Subheader>
                        <Grid> 
                            <Grid.Column width={5}>
                                <div className="cursor-pointer text-xs mt-4 underline" onClick={() => window.open(`${process.env.REACT_APP__ABOUT_EXTRA_ALCA_LOCKUP_URL}`, '_blank').focus()}>About extra ALCA lockup rewards</div>
                            </Grid.Column>
                            <Grid.Column width={5}>
                            <div className="cursor-pointer text-xs mt-4 underline" onClick={() => window.open(`${process.env.REACT_APP__ABOUT_ETH_LOCKUP_URL}`, '_blank').focus()}>About ETH % lockup rewards</div>
                            </Grid.Column>
                        </Grid>
                </Header>
            ) 
        } 
        else {
            return (
                <Header>
                    {status?.message}
                    <div className="mt-4 mb-4 text-base">
                        You have successfully locked {Number(stakedPosition.stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })} ALCA
                    </div>
                    <Header.Subheader>
                        You can check the transaction hash below {hash}
                    </Header.Subheader>
                </Header>
            )
        }
    }

    return (
        <Grid padded>
            <Grid.Column width={16}>
                <LockupHeader/>
            </Grid.Column>

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
                                content={ approvedLockup ? 
                                    "Lockup Positions" : "Approve Lockup"
                                }
                                onClick={approvedLockup ? lockupPosition : approveLockup}
                                disabled={stakedPosition.stakedAlca === 0 || status?.error }
                                loading={waiting}
                            />      
                        </div>
                    </>
                )}
                {status?.message && (!status?.error && lockedPosition.lockedAlca > 0)  && 
                    <div>
                        <Button
                            className="mt-4"
                            content={"View on Etherscan"}
                            color="black"
                            onClick={() => window.open(`${ETHERSCAN_URL}${hash}`, '_blank').focus()}
                        />
                    </div>
                }
            </Grid.Column>
        </Grid>
    )
}