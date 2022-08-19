import { Button, Container, Icon, Popup, Tab } from "semantic-ui-react";
import React, { useContext } from "react";
import { DarkThemeContext, TabPanesContext } from "contexts";
import config from "utils";
import { useSelector } from "react-redux";
import ethAdapter from "eth/ethAdapter";
import "./ActionTabs.css";

const TabPane = ({ name, component }) => {
    return {
        menuItem: name,
        render: () =>
            <Tab.Pane>
                {component()}
            </Tab.Pane>
    };
}

export function ActionTabs() {

    const { constants, string } = config;
    const { isDark, toggle } = useContext(DarkThemeContext);
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
            <div className="absolute right-0 top-0 py-2 flex flex-row gap-3 items-center">
                {web3Connected && address && (
                    <Popup
                        position="top center"
                        content="Disconnect Wallet"
                        trigger={
                            <Button icon labelPosition="left" className="m-0" onClick={disconnect}>
                                <Icon name="remove" size="small" />
                                {`${string.splitStringWithEllipsis(address, 4)}`}
                            </Button>
                        }
                    />
                )}
                <div className="field py-3">
                    <div className="ui toggle checkbox">
                        <input
                            type="checkbox"
                            value="any"
                            onChange={toggle}
                            checked={isDark}
                        />
                        <label
                            className="coloring cursor-pointer"
                            onClick={toggle}
                        >{isDark ? '🌜' : '🌞'}</label>
                    </div>
                </div>
            </div>
            <Tab
                activeIndex={activeTabPane}
                menu={{ secondary: true }}
                panes={panes}
            />
        </Container>
    );

}
