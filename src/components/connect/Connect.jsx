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
            <div className="flex justify-center items-center h-full w-full flex-grow">
                <div className="text-sm text-right">
                    {web3Connected ? (<div>
                        <Header.Subheader>
                            Connected {address}
                        </Header.Subheader>
                    </div>
                    ) : <div>
                        <Button
                            className=""
                            secondary
                            onClick={connect}
                            content="Connect Wallet"
                            loading={loading}
                        />
                    </div>

                    }
                </div>
            </div>

            <div className="absolute left-0 top-[100%]">
                <Message
                    size="mini"
                    error={!!error}
                    content={error}
                    className="mt-4"
                    hidden={!error}
                />
            </div>

        </>
    );
}
