import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Popup } from "semantic-ui-react";
import ethAdapter from "eth/ethAdapter";

export function ConnectWalletButton() {

    const { web3Connected } = useSelector(state => ({ web3Connected: state.application.web3Connected }))

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

        <Popup
            size="mini"
            position="bottom right"
            offset={[0, 4]}
            content={Boolean(error) ? error : "Connect to browser web3 wallet"}
            trigger={
                <Button
                    disabled={Boolean(web3Connected)}
                    inverted={!web3Connected}
                    secondary
                    color="black"
                    onClick={connect}
                    content={web3Connected ? 'Change Account' : 'Connect Web3'}
                />
            }
        />

    );

}