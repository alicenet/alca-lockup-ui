import React from "react";
import { useSelector } from "react-redux";
import { Grid, Menu, Segment, Header } from "semantic-ui-react";
import { Lockup, Unlock, LockupWelcome, LockupClaim, UnlockedClaim } from "components";
import { classNames } from "utils/generic";

export function LockupActions() {
    const {  web3Connected, lockedPosition, stakedPosition } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        stakedPosition: state.application.stakedPosition,
        lockedPosition: state.application.lockedPosition,
    }))

    const [activeItem, setActiveItem] = React.useState("welcome");

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
    };

    const getActiveTab = () => {
        switch (activeItem) {
            case "welcome": return <LockupWelcome stepForward={() => lockedPosition.lockedAlca > 0 ? setActiveItem("unlock") : setActiveItem("lockup")} />
            case "lockup": return <Lockup />
            case "unlock": return lockedPosition.lockupCompleted ? <UnlockedClaim /> : <Unlock />
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
                                                "opacity-40": lockedPosition.lockedAlca || !web3Connected,
                                                "text-base": true,
                                                "mb-0": true
                                            })}
                                            as="h3"
                                        >
                                            Position Available to Lockup
                                        </Header>
                                        <div className="text-xs">
                                            {`${stakedPosition.stakedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(lockedPosition.lockedAlca || !web3Connected)}
                                    active={activeItem === 'lockup'}
                                    onClick={e => handleItemClick(e, { name: "lockup" })}
                                    className={activeMenuClass("lockup")}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header
                                            className={classNames({
                                                "opacity-40": !lockedPosition.lockedAlca || !web3Connected,
                                                "text-base": true,
                                                "mb-0": true
                                            })}
                                            as="h3"
                                        >
                                            Current Lockup Position
                                        </Header>

                                        <div className="text-xs">
                                            {`${lockedPosition.lockedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!lockedPosition.lockedAlca || !web3Connected)}
                                    active={activeItem === 'unlock'}
                                    onClick={e => handleItemClick(e, { name: "unlock" })}
                                    className={activeMenuClass("unlock")}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header
                                            className={classNames({
                                                "opacity-40": !lockedPosition.lockedAlca || lockedPosition.lockupCompleted || !web3Connected,
                                                "text-base": true,
                                                "mb-0": true
                                            })}
                                            as="h3"
                                        >
                                            Claim Lockup Rewards
                                        </Header>

                                        <div className="text-xs">
                                            {`${lockedPosition.lockedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!lockedPosition.lockedAlca || lockedPosition.lockupCompleted || !web3Connected)}
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