import { AllowTokens, Connect, PhishingBox, Success, SwapTokens } from "components";
import { Container, Tab } from "semantic-ui-react";
import React, { useContext } from "react";
import { TabPanesContext } from "context";

export function ActionTabs() {

    const { activeTabPane } = useContext(TabPanesContext);

    const panes = [
        {
            menuItem: 'Phishing Notification',
            render: () =>
                <Tab.Pane attached={false}>
                    <PhishingBox />
                </Tab.Pane>
        },
        {
            menuItem: 'Connect',
            render: () =>
                <Tab.Pane attached={false}>
                    <Connect />
                </Tab.Pane>
        },
        {
            menuItem: 'Allow',
            render: () =>
                <Tab.Pane attached={false}>
                    <AllowTokens />
                </Tab.Pane>
        },
        {
            menuItem: 'Migrate',
            render: () =>
                <Tab.Pane attached={false}>
                    <SwapTokens />
                </Tab.Pane>
        },
        {
            menuItem: 'Success',
            render: () =>
                <Tab.Pane attached={false}>
                    <Success />
                </Tab.Pane>
        },

    ];

    return (
        <Container>
            <Tab
                activeIndex={activeTabPane}
                menu={{ secondary: true, pointing: false }}
                panes={panes}
            />
        </Container>
    );

}
