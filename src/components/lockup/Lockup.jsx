import React from "react";
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Grid, Header, Input, Button } from "semantic-ui-react";
import { classNames } from "utils/generic";
import { TOKEN_TYPES } from "redux/constants";

const DECIMALS = 18;
const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function Lockup() {

    const { stakedAlca, alcaBalance, alcaStakeAllowance } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        alcaBalance: state.application.balances.alca,
        alcaStakeAllowance: state.application.allowances.alcaStakeAllowance
    }))

    const dispatch = useDispatch();

    //figure out how to update this
    //user's staked amount
    const [stakeAmt, setStakeAmt] = React.useState("");
    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [allowanceMet, setAllowanceMet] = React.useState(false);
    const [hash, setHash] = React.useState("");

    React.useEffect( () => {
        setStakeAmt("")
    }, [])

    React.useEffect(() => {
        try {
            if(!stakeAmt) return;
            setStatus({});
            setAllowanceMet(ethers.BigNumber.from(alcaStakeAllowance || 0).gt(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS)));
            if(ethers.utils.parseUnits(stakeAmt || "0", DECIMALS).gt(ethers.utils.parseUnits(alcaBalance || "0", DECIMALS))) {
                setStatus({ 
                    error: true, 
                    message: "Stake amount higher than current balance"
                });
            }
        } catch (exc) {
            setStatus({ 
                error: true, 
                message: "There was a problem with your input, please verify" 
            });
        }
    // eslint-disable-next-line
    }, [stakeAmt]);

    const LockupHeader = () => {
        if(!status?.message || status.error) {
            return (
                <Header>Lockup Staked Positions
                    <Header.Subheader>
                        You currently have {Number(stakedAlca).toLocaleString(false, { maximumFractionDigits: 4 })}  ALCA staked, the lockup period is 6 months
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

    return (
        <Grid padded>
            <Grid.Column width={16}>
                <LockupHeader/>
            </Grid.Column>

            <Grid.Column width={16}>
                {(!status?.message || status.error) && (
                    <>
                        <div>
                            <Header as="h2">{stakedAlca} ALCA Staked</Header>
                        </div>
                        <div>
                            <Button
                                className="mt-4"
                                color="black"
                                content={
                                    "Lockup Positions"
                                }
                                loading={waiting}
                            />      
                        </div>
                    </>
                )}
                {status?.message && !status?.error && 
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