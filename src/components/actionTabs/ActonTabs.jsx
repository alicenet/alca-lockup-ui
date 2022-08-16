import { SwapTokens, AllowTokens } from '../index';
import { Container, Tab } from "semantic-ui-react";
import React from 'react';

export function ActionTabs() {

    const [tabIdx, setTabIdx] = React.useState(0);

    const handleTab = (data) => {
        setTabIdx(data.activeIndex);
    }

    const panes = [
        {
            menuItem: '1 - Phishing Notification',
            render: () => <Tab.Pane attached={false} ><AllowTokens setTabIdx={ (idx) => setTabIdx(idx)} /></Tab.Pane>,
        },
        {
            menuItem: '2 - Connect',
            render: () => <Tab.Pane attached={false} ><AllowTokens setTabIdx={ (idx) => setTabIdx(idx)} /></Tab.Pane>,
        },
        {
            menuItem: '3 - Allow',
            render: () => <Tab.Pane attached={false} ><AllowTokens setTabIdx={ (idx) => setTabIdx(idx)} /></Tab.Pane>,
        },
        {
            menuItem: '4 - Migrate',
            render: () => <Tab.Pane attached={false}> <SwapTokens setTabIdx={ (idx) => setTabIdx(idx)} /></Tab.Pane>,
        },
        {
            menuItem: '5 - Success',
            render: () => <Tab.Pane attached={false}> <SwapTokens setTabIdx={ (idx) => setTabIdx(idx)} /></Tab.Pane>,
        },

    ]

    return (
        <Container className="">
            <Tab activeIndex={tabIdx} onTabChange={(e, data) => { handleTab(data)}} menu={{ secondary: true, pointing: false }} panes={panes} />
        </Container>
    )

}
