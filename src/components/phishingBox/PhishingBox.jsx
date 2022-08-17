import { Button, Checkbox, Container, Header, Icon, List } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "context";

export function PhishingBox() {

    const [checked, setChecked] = useState(false);
    const { setActiveTabPane } = useContext(TabPanesContext);
    const { generic, constants } = config;

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm">

                <Header>
                    In order to proceed with the swapping process some checks need to occur:
                </Header>

                <List bulleted>

                    <List.Item className="pt-3">

                        <List.Content className="flex flex-row justify-between items-center">
                            <span>Verify contract addresses:</span>
                        </List.Content>

                        <List bulleted>
                            <List.Item className="py-3">
                                <List.Content className="flex flex-row justify-between items-center">
                                    <span>ALCA Contract Address</span>
                                    <Icon color="green" name="check" className="m-0 h-full" />
                                </List.Content>
                            </List.Item>

                            <List.Item className="py-3">
                                <List.Content className="flex flex-row justify-between items-center">
                                    <span>MadToken Contract Address</span>
                                    <Icon color="green" name="check" className="m-0 h-full" />
                                </List.Content>
                            </List.Item>
                        </List>

                    </List.Item>

                    <List.Item className="py-3">
                        <List.Content className="flex flex-row justify-between items-center">
                            <span>Metamask contract verification</span>
                            <Icon color="green" name="check" className="m-0 h-full" />
                        </List.Content>
                    </List.Item>

                    <List.Item className="py-3">
                        <List.Content className="flex flex-row justify-between items-center">
                            <span>Verify URL</span>
                            <Icon color="green" name="check" className="m-0 h-full" />
                        </List.Content>
                    </List.Item>

                    <List.Item className="py-3">
                        <List.Content className="flex flex-row justify-between items-center">
                            <span>Verify HTTPS Lock and Cert</span>
                            <Icon color="green" name="check" className="m-0 h-full" />
                        </List.Content>
                    </List.Item>

                </List>

                <Header>
                    <Checkbox
                        label="I Have read and addressed the noted concerns"
                        onChange={(e, data) => setChecked(data.checked)}
                        checked={checked}
                    />
                </Header>

            </div>

            <div className="absolute right-0 top-[105%]">
                <Button
                    color="green"
                    content="Continue"
                    className={generic.classNames(
                        "m-0",
                        { 'hidden': !checked }
                    )}
                    onClick={() => setActiveTabPane(constants.tabPanes.CONNECT)}
                />
            </div>

        </Container>

    );
}
