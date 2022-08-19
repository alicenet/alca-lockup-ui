import { Button, Checkbox, Container, Header, Icon, Image, List, Popup } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "contexts";
import AliceCertPng from 'assets/aliceCert.png';
import AluceUrlPng from 'assets/aliceUrl.png';
import ContractVerifyPng from 'assets/contractPermission.png';

const MadTokenContractAddress = process.env.REACT_APP__MadToken_CONTRACT_ADDRESS;
const AToken_CONTRACT_ADDRESS = process.env.REACT_APP__AToken_CONTRACT_ADDRESS;

const CheckIcon = ({ isChecked }) => {
    return (
        <Icon
            color={isChecked ? "green" : "red"}
            name={isChecked ? "check" : "x"}
            className="m-0 h-full"
        />
    );
};

const LinkedListItem = ({ text, link, isChecked }) => {
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
                <CheckIcon isChecked={isChecked} />
            </List.Content>
        </List.Item>
    );
};

export function PhishingBox() {

    const [isChecked, setIsChecked] = useState(false);
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
                                    isChecked={isChecked}
                                />

                                <LinkedListItem
                                    text={`MadToken Contract Address (${MadTokenContractAddress})`}
                                    link={`https://etherscan.io/address/${MadTokenContractAddress}`}
                                    isChecked={isChecked}
                                />
                            </List>

                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src={ContractVerifyPng}
                                            rounded
                                        />
                                    }
                                    trigger={<span>Metamask contract verification</span>}
                                />
                                <CheckIcon isChecked={isChecked} />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src={AluceUrlPng}
                                            rounded
                                        />
                                    }
                                    trigger={<span>Verify URL</span>}
                                />
                                <CheckIcon isChecked={isChecked} />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top center"
                                    content={
                                        <Image
                                            src={AliceCertPng}
                                            rounded
                                        />
                                    }
                                    trigger={<span>Verify HTTPS Lock and Cert</span>}
                                />
                                <CheckIcon isChecked={isChecked} />
                            </List.Content>
                        </List.Item>

                    </List>

                    <Header>
                        <Checkbox
                            label="I have read and addressed the above security checklist"
                            onChange={(e, data) => setIsChecked(data.checked)}
                            checked={isChecked}
                        />
                    </Header>

                </div>

            </Container>

            <div className="absolute mt-4 right-0 top-[100%]">
                <Button
                    color="green"
                    content="Continue"
                    className={generic.classNames("m-0", { 'hidden': !isChecked })}
                    onClick={() => setActiveTabPane(constants.tabPanes.CONNECT)}
                />
            </div>

        </>
    );
}
