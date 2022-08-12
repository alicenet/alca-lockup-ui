import { SwapTokens, AllowTokens } from '../index';
import { Container, Tab } from "semantic-ui-react";

export function ActionTabs() {

    const panes = [
        {
            menuItem: 'Allow',
            render: () => <Tab.Pane attached={false}><AllowTokens /></Tab.Pane>,
        },
        {
            menuItem: 'Swap',
            render: () => <Tab.Pane attached={false}> <SwapTokens /></Tab.Pane>,
        },

    ]

    return (
        <Container className="">
            <Tab menu={{ secondary: true, pointing: false }} panes={panes} />
        </Container>
    )

}
