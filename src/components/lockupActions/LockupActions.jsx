import React from "react";
import { useSelector } from "react-redux";
import { Grid, Menu, Segment, Header } from "semantic-ui-react";
import { Connect, Lockup, Unlock, LockupWelcome, LockupClaim } from "components";
import { classNames } from "utils/generic";

export function LockupActions() {
    const { hasReadTerms, web3Connected, lockedPosition, stakedPosition } = useSelector(state => ({
        hasReadTerms: state.application.hasReadTerms,
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
            case "welcome": return <LockupWelcome stepForward={() => lockedPosition.lockedAlca > 0 ? setActiveItem("unlock") : setActiveItem("lockup") } />
            case "lockup": return <Lockup />
            case "unlock": return <Unlock />
            case "claim": return <LockupClaim />
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
                                        <Header className={classNames({ "opacity-40": !hasReadTerms || stakedPosition.stakedAlca || !web3Connected })}>Lockup</Header>
                                        <Header as="h2" className="text-sm">ALCA Staked Position</Header>
                                        <div className="text-xs">
                                        {`${stakedPosition.stakedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || !stakedPosition.stakedAlca || !web3Connected)}
                                    active={activeItem === 'lockup'}
                                    onClick={e => handleItemClick(e, { name: "lockup" })}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header className={classNames({ "opacity-40": !hasReadTerms /*|| !lockedAlca > 0*/ })}>Unlock</Header>
                                        <Header as="h2" className="text-sm">Locked Position</Header>
                                        <div className="text-xs">
                                        {`${lockedPosition.lockedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || !lockedPosition.lockedAlca || !web3Connected)}
                                    active={activeItem === 'unlock'}
                                    onClick={e => handleItemClick(e, { name: "unlock" })}
                                />

                                <Menu.Item
                                    content={<>
                                        <Header className={classNames({ "opacity-40": !hasReadTerms /*|| !lockedAlca > 0*/ })}>Lockup Rewards</Header>
                                        <Header as="h2" className="text-sm">Locked Position</Header>
                                        <div className="text-xs">
                                            {`${lockedPosition.lockedAlca}
                                                ALCA`}
                                        </div>
                                    </>}
                                    disabled={Boolean(!hasReadTerms || !lockedPosition.lockedAlca || !web3Connected)}
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