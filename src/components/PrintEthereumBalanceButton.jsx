import React from 'react';
import { Form } from 'semantic-ui-react';
import { GlobalContext } from '../context';
import ethAdapter from '../eth/ethAdapter';

export default function PrintEthereumBalanceButton() {

    const globalContext = React.useContext(GlobalContext);
    const connected = globalContext.web3Connected;
    const [ethBalance, setEthBalance] = React.useState("0");

    const printBalance = async () => {
        let balance = await ethAdapter.getEthereumBalance(true)
        setEthBalance(balance);
    }

    return (

        <Form size="mini">
            <Form.Input
                actionPosition="left"
                action={{
                    size: "small",
                    content: "Print ETH Balance",
                    onClick: printBalance,
                    disabled: !connected,
                }}
                value={connected ? (Number(ethBalance).toFixed(5) + " Ether") : "Not Connected"}
                readOnly
            />
        </Form>

    )

}