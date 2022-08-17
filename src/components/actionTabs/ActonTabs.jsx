import { Container, Tab } from "semantic-ui-react";
import React, { useContext } from "react";
import { TabPanesContext } from "context";
import { tabPanes } from "utils/constants";

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

    const { activeTabPane } = useContext(TabPanesContext);

    const panes = Object.keys(tabPanes).map(tabPane => TabPane({
        name: tabPanes[tabPane].name,
        component: tabPanes[tabPane].component
    }));

    return (
        <Container>
            <Tab
                activeIndex={activeTabPane}
                menu={{ secondary: true }}
                panes={panes}
            />
        </Container>
    );

}
