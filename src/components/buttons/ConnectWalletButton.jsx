import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import ethAdapter from "eth/ethAdapter";

export function ConnectWalletButton() {

    const { web3Connected } = useSelector(state => ({ web3Connected: state.application.web3Connected }));

    const [error, setError] = useState(false);

    const connect = () => {
        ethAdapter.connectToWeb3Wallet((err) => {
            if (err) {
                console.error(err?.error);
                setError(err?.error);
            }
        })
    }

    return (

        <Button
            className="m-0"
            disabled={Boolean(web3Connected)}
            inverted={!web3Connected}
            secondary
            color="black"
            onClick={connect}
            content={web3Connected ? 'Change Account' : 'Connect Wallet'}
        />

    );

}