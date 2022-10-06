import React from "react";


import { useDispatch, useSelector } from "react-redux";
import { Grid, Header, Button} from "semantic-ui-react";


const ETHERSCAN_URL = process.env.REACT_APP__ETHERSCAN_TX_URL || "https://etherscan.io/tx/";

export function LockupClaim() {

    const { stakedAlca, lockedAlca, ethReward, alcaReward } = useSelector(state => ({
        stakedAlca: state.application.stakedPosition.stakedAlca,
        lockedAlca: state.application.lockedPosition.lockedAlca,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward
    }))

    const dispatch = useDispatch();

    //figure out how to update this
    //user's staked amount
    const [waiting, setWaiting] = React.useState(false);
    const [status, setStatus] = React.useState({});
    const [hash, setHash] = React.useState("");

    const ClaimHeader = () => {
        if(!status?.message || status.error) {
            return (
                <Header>Locked Positions
                    <Header.Subheader>
                        You currently have {`${lockedAlca}`}  ALCA on Lockup
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
                    </Header.Subheader>
                </Header>
            )
        }
    }

    return (
        <Grid padded>
            <Grid.Column width={16}>
                <ClaimHeader/>
            </Grid.Column>

            <Grid.Column width={16}>
                {(!status?.message || status.error) && (
                    <>
                        <div>
                            <Header as="h1">{stakedAlca} ALCA Staked and Locked</Header>
                            <Header as="h3">
                                Available accumulated rewards: 
                            </Header>
                            <Header as="h3">
                                {`${ethReward} ETH / ${alcaReward} ALCA`}
                            </Header>
                            <Header as="h3">
                                {``}
                            </Header>
                            <Header as="h3">
                                
                            </Header>

                        </div>
                        <div>
                            <Button
                                className="mt-4"
                                color="black"
                                content={
                                    "Claim rewards"
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