import { Button, Checkbox, Container, Header, Icon, Image, List, Popup } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "contexts";
import AliceCertPng from 'assets/aliceCert.png';
import AluceUrlPng from 'assets/aliceUrl.png';
import ContractVerifyPng from 'assets/contractPermission.png';

const MadTokenContractAddress = process.env.REACT_APP__MadToken_CONTRACT_ADDRESS;
const AToken_CONTRACT_ADDRESS = process.env.REACT_APP__AToken_CONTRACT_ADDRESS;

const CheckIcon = ({ isChecked, toggleCheck }) => {
    return (
        <Icon
            color={isChecked ? "green" : ""}
            name={isChecked ? "check" : "square outline"}
            size={isChecked ? "large" : "large"}
            className="m-0 h-full hover:cursor-pointer outline-none"
            onClick={toggleCheck}
        />
    );
};

const LinkedListItem = ({ text, link, isChecked, toggleCheck }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <List.Item className="py-3">
            <List.Content className="flex flex-row justify-between items-center">
                <div
                    onMouseOver={() => setHovered(prevState => !prevState)}
                    onMouseLeave={() => setHovered(prevState => !prevState)}
                    className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 h-6"
                    onClick={() => window.open(link, '_blank').focus()}
                >
                    {text}
                    {hovered && <Icon name="external" className="m-0 h-full" />}
                </div>
                <CheckIcon isChecked={isChecked} toggleCheck={toggleCheck} />
            </List.Content>
        </List.Item>
    );
};

export function PhishingBox() {

    const { setActiveTabPane } = useContext(TabPanesContext);
    const { generic, constants } = config;

    const [checkState, setCheckState] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const allChecked = (() => {
        let missingCheck;
        Object.values(checkState).forEach(value => {
            if (value === false) {
                missingCheck = true;
            }
        });
        return !!missingCheck ? false : true;
    })()

    console.log(allChecked);

    const toggleCheck = (checkNum) => {
        setCheckState(s => ({ ...s, [checkNum]: !s[checkNum] }));
    };



    return (

        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm">

                    <Header>
                        Before proceeding with the migration please verify the following:
                        <Header.Subheader>
                            Hover each bullet for possible additional information
                        </Header.Subheader>
                    </Header>

                    <List bulleted>

                        <List.Item className="pt-3">

                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top left"
                                    content="Contracts should be verified on etherscan by comparing contract addresses to other published media by alice.net"
                                    trigger={(
                                        <Header as="h5">
                                            <span>Verify both contract addresses on etherscan</span>
                                        </Header>
                                    )}
                                />
                            </List.Content>

                            <List bulleted>
                                <br />
                                <Header.Subheader>Verify the contract is the expected contract address and is verified on etherscan</Header.Subheader>
                                <LinkedListItem
                                    text={`ALCA Contract Address (${AToken_CONTRACT_ADDRESS})`}
                                    link={`https://etherscan.io/address/${AToken_CONTRACT_ADDRESS}`}
                                    isChecked={checkState[1]} toggleCheck={() => toggleCheck(1)}
                                />

                                <br />
                                <Header.Subheader>Verify the contract is the expected contract address and is verified on etherscan</Header.Subheader>
                                <LinkedListItem
                                    text={`MadToken Contract Address (${MadTokenContractAddress})`}
                                    link={`https://etherscan.io/address/${MadTokenContractAddress}`}
                                    isChecked={checkState[2]} toggleCheck={() => toggleCheck(2)}
                                />
                            </List>

                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top left"
                                    content={
                                        <Image
                                            src={AluceUrlPng}
                                            rounded
                                        />
                                    }
                                    trigger={(
                                        <Header as="h5">
                                            <span>Verify the URL</span>
                                            <br />
                                            <Header.Subheader className="opacity-60">Verify the url in your browser is https://alca.alice.net</Header.Subheader>
                                        </Header>
                                    )}
                                />
                                <CheckIcon isChecked={checkState[4]} toggleCheck={() => toggleCheck(4)} />
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
                                    trigger={(
                                        <Header as="h5">
                                            <span>Verify the HTTPS Certificate</span>
                                            <br />
                                            <Header.Subheader className="opacity-60">Check that the HTTPS certificate is for https://alca.alice.net</Header.Subheader>
                                        </Header>
                                    )} />
                                <CheckIcon isChecked={checkState[5]} toggleCheck={() => toggleCheck(5)} />
                            </List.Content>
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
                                    trigger={<span>Verify contract interaction</span>}
                                />
                                <CheckIcon isChecked={checkState[3]} toggleCheck={() => toggleCheck(3)} />
                            </List.Content>
                        </List.Item>

                    </List>

                    <Header>
                        <Checkbox
                            label="I have addressed the above security checklist"
                            checked={allChecked}
                        />
                    </Header>

                </div>

            </Container>

            <div className="absolute mt-4 right-0 top-[100%]">
                <Button
                    color="green"
                    content="Continue"
                    disabled={!allChecked}
                    className={generic.classNames("m-0", { 'opacity-20': !allChecked })}
                    onClick={() => setActiveTabPane(constants.tabPanes.CONNECT)}
                />
            </div>

        </>
    );
}
