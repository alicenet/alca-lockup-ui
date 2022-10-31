import React from "react";
import { useSelector } from "react-redux";
import { Grid, Menu, Segment, Header } from "semantic-ui-react";
import { LOCKUP_PERIOD_STATUS } from 'redux/constants';
import { Lockup, UnlockEarly, LockupWelcome, LockupClaim, Unlock } from "components";
import { classNames } from "utils/generic";

export function LockupActions() {
    const {  web3Connected, lockedPosition, stakedPosition, ethReward, alcaReward } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        stakedPosition: state.application.stakedPosition,
        lockedPosition: state.application.lockedPosition,
        ethReward: state.application.lockedPosition.ethReward,
        alcaReward: state.application.lockedPosition.alcaReward,
    }))

    const [activeItem, setActiveItem] = React.useState("welcome");
    const lockupPeriodEnded = lockedPosition.lockupPeriod === LOCKUP_PERIOD_STATUS.END;

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };

    const getActiveTab = () => {
        switch (activeItem) {
            case "welcome": return <LockupWelcome stepForward={() => lockedPosition.lockedAlca > 0 ? setActiveItem("unlock") : setActiveItem("lockup")} />
            case "lockup": return <Lockup />
            case "unlock": return lockupPeriodEnded ? <Unlock /> : <UnlockEarly />
            case "claim": return <LockupClaim />
            default: return;
        }
    };

    const activeMenuClass = (checkAgainst) => {
        return checkAgainst === activeItem ? "border-l-aliceblue border-l-[3px]" : ""
    }

    return (
        <div className="flex justify-center w-full">
            <div className="max-w-[1200px] w-full mt-12">

                <Grid padded className="flex h-full">

                    <Grid.Row>
                        <Grid.Column width={4} stretched className="pr-0">
                            <Menu fluid vertical tabular>
                                <Menu.Item
                                    content={<Header className="text-base mb-0">Lockup</Header>}
                                    active={activeItem === 'welcome'}
                                    onClick={e => handleItemClick(e, { name: "welcome" })}
                                    className={activeMenuClass("welcome")}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header
                                            className={classNames({
                                                "opacity-40": !['0.0', 0].includes(lockedPosition.lockedAlca) || !web3Connected,
                                                "text-base": true,
                                                "mb-0": true
                                            })}
                                            as="h3"
                                        >
                                            {!lockupPeriodEnded ? 'Position Available to Lockup' : 'Currently Staked Position'}
                                        </Header>
                                        <div className="text-xs">
                                            {`${stakedPosition.stakedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!['0.0', 0].includes(lockedPosition.lockedAlca) || !web3Connected)}
                                    active={activeItem === 'lockup'}
                                    onClick={e => handleItemClick(e, { name: "lockup" })}
                                    className={activeMenuClass("lockup")}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header
                                            className={classNames({
                                                "opacity-40": ['0.0', 0].includes(lockedPosition.lockedAlca) || !web3Connected,
                                                "text-base": true,
                                                "mb-0": true
                                            })}
                                            as="h3"
                                        >
                                            Current Lockup Position
                                        </Header>

                                        <div className="text-xs">
                                            {`${lockedPosition.lockedAlca || 0}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(['0.0', 0].includes(lockedPosition.lockedAlca) || !web3Connected)}
                                    active={activeItem === 'unlock'}
                                    onClick={e => handleItemClick(e, { name: "unlock" })}
                                    className={activeMenuClass("unlock")}
                                />

                                <Menu.Item
                                    content={
                                        <>
                                            <Header
                                                className={classNames({
                                                    "opacity-40": ['0.0', 0].includes(lockedPosition.lockedAlca) || lockupPeriodEnded || !web3Connected,
                                                    "text-base": true,
                                                    "mb-0": true
                                                })}
                                                as="h3"
                                            >
                                                Claim Lockup Rewards
                                            </Header>

                                            <div className="text-xs">
                                                {ethReward || 0} ETH / {alcaReward || 0} ALCA
                                            </div>
                                        </>
                                    }
                                    disabled={Boolean(['0.0', 0].includes(lockedPosition.lockedAlca) || lockupPeriodEnded || !web3Connected)}
                                    active={activeItem === 'claim'}
                                    onClick={e => handleItemClick(e, { name: "claim" })}
                                    className={activeMenuClass("claim")}
                                />
                            </Menu>
                        </Grid.Column>

                        <Grid.Column stretched width={12} className="pl-0">
                            <Segment className="border-l-0 shadow-none rounded-none flex w-full h-full flex-grow">
                                {getActiveTab()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </div>
    );
}