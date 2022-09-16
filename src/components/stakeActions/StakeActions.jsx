import { Connect } from "components/connect/Connect";
import { StakeClaim } from "components/stakeClaim/StakeClaim";
import { StakeStake } from "components/stakeStake/StakeStake";
import { StakeUnstake } from "components/stakeUnstake/StakeUnstake";
import { StakeWelcome } from "components/stakeWelcome/StakeWelcome";
import React from "react";
import { useSelector } from "react-redux";
import { Grid, Menu, Segment, Header } from 'semantic-ui-react'
import { classNames } from "utils/generic";

export function StakeActions() {

    const { hasReadTerms, alcaBalance, web3Connected, stakedAlca, ethRewards, alcaRewards } = useSelector(state => ({
        hasReadTerms: state.application.hasReadTerms,
        alcaBalance: state.application.balances.alca,
        web3Connected: state.application.web3Connected,
        stakedAlca: state.application.stakedPosition.stakedAlca,
        ethRewards: state.application.rewards.eth,
        alcaRewards: state.application.rewards.alca
    }))

    const [activeItem, setActiveItem] = React.useState("welcome");

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };

    const getActiveTab = () => {
        switch (activeItem) {
            case "welcome": return <StakeWelcome stepForward={() => setActiveItem("stake")} />
            case "stake": return <StakeStake />
            case "unstake": return <StakeUnstake />
            case "claim": return <StakeClaim />
            default: return;
        }
    };

    return (
        <div className="flex justify-center w-full">

            <div className="max-w-[1200px] w-full mt-12">

                <Grid padded className="flex h-full">

                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu fluid vertical tabular>
                                <Menu.Item
                                    content={web3Connected ? <>
                                        <div className="text-sm">{hasReadTerms ? "Wallet Connected" : "Welcome"}</div>
                                    </> : (<Connect />)}
                                    active={activeItem === 'welcome'}
                                    onClick={e => handleItemClick(e, { name: "welcome" })}
                                    disabled={Boolean(hasReadTerms)}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header className={classNames({ "opacity-40": !hasReadTerms || stakedAlca })}>Stake</Header>
                                        <div className="text-xs">
                                            {Number(alcaBalance).toLocaleString(false, {maximumFractionDigits: 4})} ALCA Available
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || stakedAlca)}
                                    active={activeItem === 'stake'}
                                    onClick={e => handleItemClick(e, { name: "stake" })}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header className={classNames({ "opacity-40": !hasReadTerms || !stakedAlca > 0 })}>Unstake</Header>
                                        <div className="text-xs">
                                            {stakedAlca > 0 
                                                ? `${stakedAlca} ALCA` 
                                                : "No ALCA staked"}
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || !stakedAlca)}
                                    active={activeItem === 'unstake'}
                                    onClick={e => handleItemClick(e, { name: "unstake" })}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header className={classNames({ "opacity-40": !hasReadTerms || (alcaRewards === 0 && ethRewards === 0 && !stakedAlca) })}>Claim</Header>
                                        <div className="text-xs">
                                            {ethRewards > 0 ? "" : "No ETH to claim"}
                                        </div>
                                        <div className="text-xs">
                                            {alcaRewards > 0 ? "" : "No ALCA to claim"}
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || (ethRewards === 0 && alcaRewards === 0 && !stakedAlca))}
                                    active={activeItem === 'claim'}
                                    onClick={e => handleItemClick(e, { name: "claim" })}
                                />
                            </Menu>
                        </Grid.Column>

                        <Grid.Column stretched width={13}>
                            <Segment>
                                {getActiveTab()}
                            </Segment>
                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>

        </div>
    );

}
