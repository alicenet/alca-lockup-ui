import { Button, Container, Icon, Popup, Tab } from "semantic-ui-react";
import React, { useContext } from "react";
import { TabPanesContext } from "contexts";
import config from "utils";
import { useSelector } from "react-redux";
import ethAdapter from "eth/ethAdapter";
import "./SwapActions.css";
import { utils } from "ethers";
import { splitStringWithEllipsis } from "utils/string";
import { classNames } from "utils/generic";

const TabPane = ({ name, component, className }) => {
    return {
        menuItem: name,
        render: () =>
            <Tab.Pane className={className}>
                {component()}
            </Tab.Pane>
    };
}

export function SwapActions() {

    const { constants, string } = config;
    const { activeTabPane, setActiveTabPane } = useContext(TabPanesContext);
    const { web3Connected, address } = useSelector(state => ({
        address: state.application.connectedAddress,
        web3Connected: state.application.web3Connected
    }));

    const panes = Object.keys(constants.tabPanes).map(tabPane => TabPane({
        name: constants.tabPanes[tabPane].name,
        component: constants.tabPanes[tabPane].component,
    }));

    const disconnect = () => {
        ethAdapter.disconnectWeb3Wallet((err) => {
            if (!err) {
                setActiveTabPane(constants.tabPanes.CONNECT);
            }
        });
    };

    return (
        <Container className="relative">
            <div className="absolute right-0 top-[2px] items-center">
                {web3Connected && address && (
                    <Popup
                        position="top center"
                        content="Disconnect Wallet"
                        trigger={
                            <Button icon labelPosition="left" className="m-0" onClick={disconnect}>
                                <Icon name="remove" size="small" />
                                <div className="text-sm">
                                    Connected:
                                    {splitStringWithEllipsis(address, 4)}
                                </div>
                            </Button>
                        }
                    />
                )}
            </div>
            <Tab
                activeIndex={activeTabPane}
                menu={{ secondary: true, className: "" }}
                panes={panes}
            />
        </Container>
    );

}
