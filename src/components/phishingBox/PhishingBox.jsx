import { Button, Checkbox, Container, Header, Icon, Image, List, Popup } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "context";

const MadTokenContractAddress = process.env.REACT_APP__MadToken_CONTRACT_ADDRESS;
const AToken_CONTRACT_ADDRESS = process.env.REACT_APP__AToken_CONTRACT_ADDRESS;

const CheckIcon = ({isChecked}) => <Icon color={isChecked ? "green" : "red"} name={isChecked ? "check" : "x"} className="m-0 h-full" />

const LinkedListItem = ({ text, link }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <List.Item className="py-3">
            <List.Content className="flex flex-row justify-between items-center">
                <div
                    onMouseOver={() => setHovered(prevState => !prevState)}
                    onMouseLeave={() => setHovered(prevState => !prevState)}
                    className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80"
                    onClick={() => window.open(link, '_blank').focus()}
                >
                    {text}
                    {hovered && <Icon name="external" className="m-0 h-full" />}
                </div>
                <CheckIcon isChecked/> 
            </List.Content>
        </List.Item>
    );
};

export function PhishingBox() {

    const [checked, setChecked] = useState(false);
    const { setActiveTabPane } = useContext(TabPanesContext);
    const { generic, constants } = config;

    return (

        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm">

                    <Header>
                        Before proceeding with the migration please verify the following:
                    </Header>

                    <List bulleted>

                        <List.Item className="pt-3">

                            <List.Content className="flex flex-row justify-between items-center">
                                <span>Verify both contract addresses:</span>
                            </List.Content>

                            <List bulleted>
                                <LinkedListItem
                                    text={`ALCA Contract Address (${AToken_CONTRACT_ADDRESS})`}
                                    link={`https://etherscan.io/address/${AToken_CONTRACT_ADDRESS}`}
                                />

                                <LinkedListItem
                                    text="MadToken Contract Address"
                                    link={`https://etherscan.io/address/${MadTokenContractAddress}`}
                                />
                            </List>

                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src='https://react.semantic-ui.com/images/wireframe/square-image.png'
                                            rounded
                                        />
                                    }
                                    trigger={<span>Metamask contract verification</span>}
                                />
                                <CheckIcon isChecked />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src='https://react.semantic-ui.com/images/wireframe/square-image.png'
                                            rounded
                                        />
                                    }
                                    trigger={<span>Verify URL</span>}
                                />
                                <CheckIcon isChecked />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src='https://react.semantic-ui.com/images/wireframe/square-image.png'
                                            rounded
                                        />
                                    }
                                    trigger={<span>Verify HTTPS Lock and Cert</span>}
                                />
                                <CheckIcon isChecked />
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

            </Container>

            <div className="absolute mt-4 right-0 top-[100%]">
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

        </>
    );
}
