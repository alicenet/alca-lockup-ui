import React from "react";
import { useSelector } from "react-redux";
import { Grid, Header, Button } from 'semantic-ui-react'

export function StakeUnstake() {
    const { stakedAlca } = useSelector(state => ({
        stakedAlca: state.application.balances.stakedAlca,
    }))

    const unstakePosition = () => {
        console.log('unstaking..');
    }

    return (
        <Grid padded >
            <Grid.Column width={16}>
                <Header>Unstake ALCA Position
                    <Header.Subheader>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Header.Subheader>
                </Header>
            </Grid.Column>

            <Grid.Column width={16}>
                <div>
                    <Header as="h2">{stakedAlca} ALCA</Header>

                    <Header as="h3">Rewards to Claim: 0.02456789012345678 ETH</Header>

                    <p>Rewards will be sent automatically to your wallet</p>
                </div>

                <div>
                    <Button
                        className="mt-4"
                        color="black"
                        content={"Unstake Position"}
                        onClick={unstakePosition}
                        disabled={false}
                        loading={false}
                    />
                </div>

                {/* <div className={classNames("text-xs mt-8", { hidden: allowanceMet })}>
                    *Prior to your first staked position you will be asked to approve the Staking Contract a large amount of tokens. Wallets like metamask will allow you to change this amount, and you are more than welcome to, however additional approval transactions will cost more in gas.
                </div> */}
            </Grid.Column>
        </Grid>
    )
}
