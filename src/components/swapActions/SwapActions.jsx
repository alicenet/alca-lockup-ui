import { Button, Container, Icon, Tab } from "semantic-ui-react";
import React, { useContext } from "react";
import { TabPanesContext } from "contexts";
import config from "utils";
import { useSelector } from "react-redux";
import ethAdapter from "eth/ethAdapter";

const TabPane = ({ name, component }) => {
    return {
        menuItem: name,
        render: () =>
            <Tab.Pane>
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
        component: constants.tabPanes[tabPane].component
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
            {web3Connected && address && (
                <div className="absolute right-0 top-0 py-2">
                    <Button icon labelPosition="left" className="m-0" onClick={disconnect}>
                        <Icon name="remove" size="small" />
                        {`${string.splitStringWithEllipsis(address, 4)}`}
                    </Button>
                </div>
            )}
            <Tab
                activeIndex={activeTabPane}
                menu={{ secondary: true }}
                panes={panes}
            />
        </Container>
    );

}
