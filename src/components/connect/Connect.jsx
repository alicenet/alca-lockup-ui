import { Button, Container } from "semantic-ui-react";
import React, { useContext } from "react";
import config from "utils";
import { TabPanesContext } from "context";
import { ConnectWalletButton } from "../buttons/ConnectWalletButton";
import { useSelector } from "react-redux";

export function Connect() {

    const { generic, constants } = config;
    const { setActiveTabPane } = useContext(TabPanesContext);
    const { web3Connected, address } = useSelector(state => ({
        address: state.application.connectedAddress,
        web3Connected: state.application.web3Connected
    }));

    return (

        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm text-center">
                    {web3Connected ? (
                            <>
                                ...{address.slice(32)} is connected
                            </>
                        ) :
                        <ConnectWalletButton />
                    }
                </div>

            </Container>

            <div className="absolute mt-4 right-0 top-[100%]">
                <Button
                    color="green"
                    content="Continue"
                    className={generic.classNames(
                        "m-0",
                        { 'hidden': !web3Connected }
                    )}
                    onClick={() => setActiveTabPane(constants.tabPanes.ALLOW)}
                />
            </div>

        </>

    );
}
