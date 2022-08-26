import { Button, Checkbox, Container, Header, Icon, Image, List, Popup } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "contexts";
import AliceCertPng from 'assets/aliceCert.png';
import AluceUrlPng from 'assets/aliceUrl.png';
import ContractVerifyPng from 'assets/contractPermission.png';
import { classNames } from "utils/generic";

const MadTokenContractAddress = process.env.REACT_APP__MadToken_CONTRACT_ADDRESS;
const AToken_CONTRACT_ADDRESS = process.env.REACT_APP__AToken_CONTRACT_ADDRESS;

const CheckIcon = ({ isChecked, toggleCheck }) => {
    return (
        <Icon
            color={isChecked ? "green" : ""}
            name={isChecked ? "check" : "square outline"}
            size={isChecked ? "large" : "large"}
            className="m-0 h-full hover:cursor-pointer outline-none p-1.5"
            onClick={toggleCheck}
        />
    );
};

const LinkedListItem = ({ text, link, isChecked, toggleCheck, className }) => {
    return (<div className="flex items-center justify-between">
        <div
            className="flex text-blue-500 underline flex-row gap-2 items-center cursor-pointer hover:opacity-80 h-6"
            onClick={() => window.open(link, '_blank').focus()}
        >
            {text}
            <Icon name="external" className="m-0 h-full" />
        </div>
        <CheckIcon isChecked={isChecked} toggleCheck={toggleCheck} />
    </div>);
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

    React.useEffect(() => {


        const debugAllCheck = (e) => {
            if (e.keyCode === 186) {
                setCheckState({
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                    5: true,
                })
            }
        }

        document.addEventListener('keydown', debugAllCheck);

        return () => {
            document.removeEventListener('keydown', debugAllCheck);
        }

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

    const toggleCheck = (checkNum) => {
        setCheckState(s => ({ ...s, [checkNum]: !s[checkNum] }));
    };

    return (

        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm">

                    <Header>
                        Before proceeding with the migration please read the following tips
                        <Header.Subheader>
                            Hover <Icon size="small" name="question circle" className="mr-0 ml-0 relative -top-.5" /> for additional information and check each box as you go
                        </Header.Subheader>
                    </Header>

                    <List >

                        <List.Item className="pt-3">

                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top left"
                                    content={<div className="text-xs w-[320px]">Contracts should be verified on etherscan by comparing contract addresses to other published media by the contract author(s)</div>}
                                    trigger={(
                                        <div className="flex items-center">
                                            <Header as="h5" className="text-alice-blue cursor-default">
                                                <span>Verify both contract addresses on etherscan</span>
                                            </Header>
                                            <Icon name="question circle" size="small" className="ml-2" />
                                        </div>
                                    )}
                                />
                            </List.Content>

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

                        </List.Item>

                        <List.Item className="py-3 mt-2">
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
                                        <div className="flex items-center">
                                            <Header as="h5" className="text-alice-blue cursor-default">
                                                <div className="flex items-center">
                                                    <span>Verify the URL</span>
                                                    <Icon name="question circle" size="small" className="ml-2" />
                                                </div>
                                                <Header.Subheader className="opacity-60">Verify the url in your browser is https://alca.alice.net</Header.Subheader>
                                            </Header>
                                        </div>
                                    )}
                                />
                                <CheckIcon isChecked={checkState[4]} toggleCheck={() => toggleCheck(4)} />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top left"
                                    content={
                                        <Image
                                            src={AliceCertPng}
                                            rounded
                                        />
                                    }
                                    trigger={(
                                        <div className="flex items-center">
                                            <Header as="h5" className="text-alice-blue cursor-default">
                                                <div className="flex items-center">
                                                    <span>Verify the HTTPS Certificate</span>
                                                    <Icon name="question circle" size="small" className="ml-2" />
                                                </div>
                                                <Header.Subheader className="opacity-60">Check that the HTTPS certificate is for https://alca.alice.net</Header.Subheader>
                                            </Header>
                                        </div>
                                    )} />
                                <CheckIcon isChecked={checkState[5]} toggleCheck={() => toggleCheck(5)} />
                            </List.Content>
                        </List.Item>

                        <List.Item className="py-3">
                            <List.Content className="flex flex-row justify-between items-center">
                                <Popup
                                    position="top left"
                                    content={
                                        <div>
                                            <div className="text-xs w-[320px]">When interacting with contracts verify the contract address</div>
                                            <Image
                                                src={ContractVerifyPng}
                                                rounded
                                            />
                                        </div>
                                    }
                                    trigger={
                                        <div className="flex items-center">

                                            <Header as="h5" className="text-alice-blue cursor-default">
                                                <div className="flex items-center">
                                                    <span>Be aware of contract interaction</span>
                                                    <Icon name="question circle" size="small" className="ml-2" />
                                                </div>
                                                <Header.Subheader className="opacity-60">During transaction check the contract being called by your wallet is correct</Header.Subheader>
                                            </Header>
                                        </div>
                                    }
                                />
                                <CheckIcon isChecked={checkState[3]} toggleCheck={() => toggleCheck(3)} />
                            </List.Content>
                        </List.Item>

                    </List>

                    <div className="text-[14px] font-bold flex justify-between items-center mt-8">
                        <span className={classNames({
                            "text-red-400": !allChecked,
                            "text-green-500": allChecked
                        })}>
                            - I have addressed the above security tips
                        </span>
                        <Icon name={allChecked ? "check" : "x"} color={allChecked ? "green" : "red"} size="large" className="ml-6 m-0 h-full text-2xl" />
                    </div>

                </div>

            </Container>

            <div className="absolute mt-4 right-0 top-[100%]">
                <Button
                    primary
                    content="Continue"
                    disabled={!allChecked}
                    className={generic.classNames("m-0", { 'opacity-20': !allChecked })}
                    onClick={() => setActiveTabPane(constants.tabPanes.CONNECT)}
                />
            </div>

        </>
    );
}
