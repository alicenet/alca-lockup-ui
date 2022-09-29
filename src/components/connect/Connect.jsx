import { Button, Container, Header, Message } from "semantic-ui-react";
import React, { useState } from "react";
import config from "utils";
import { useSelector } from "react-redux";
import ethAdapter from "eth/ethAdapter";
import { useCookies } from "react-cookie";

export function Connect() {

    const { generic } = config;
    const [error, setError] = useState("");
    const { web3Connected, address } = useSelector(state => ({
        address: state.application.connectedAddress,
        web3Connected: state.application.web3Connected,
    }));

    const [loading, setLoading] = React.useState(false);

    const [agreeCookie] = useCookies(['agreed']);

    const connect = async () => {
        setError("");
        setLoading(true)
        await ethAdapter.connectToWeb3Wallet((err) => {
            if (err) {
                console.error(err?.error);
                setError(err?.error);
            }
        });

        setLoading(false)

    };

    return (

        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm text-center">
                    {web3Connected ? (<div>
                        <Header as='h5' content={`${address} connected`} />

                        <Header.Subheader>
                            Connected {address}
                        </Header.Subheader>

                    </div>
                    ) : <div>
                        <>{(agreeCookie?.agreed) ? 
                            <>
                                <Button
                                    className="m-0 mt-8"
                                    secondary
                                    color="black"
                                    onClick={connect}
                                    content="Connect Wallet"
                                    loading={loading}
                                />
                            </> : "Please read and agree to Staking T&C first"}
                        </>
                    </div>

                    }
                </div>

            </Container>

            <div className="absolute left-0 top-[100%]">
                <Message
                    size="mini"
                    error={!!error}
                    content={error}
                    className="mt-4"
                    hidden={!error}
                />
            </div>

            <div className="absolute mt-4 right-0 top-[100%]">
                <Button
                    primary
                    content="Continue"
                    className={generic.classNames("m-0", { 'hidden': !web3Connected })}
                    onClick={() => {}}
                />
            </div>

        </>

    );
}
