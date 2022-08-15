import { Header, Container, Input, Button } from "semantic-ui-react";
import { useSelector } from "react-redux";
import React from "react";
import ethAdapter from "eth/ethAdapter";


export function SwapTokens() {

    const [migrateAmount, setMigrateAmount] = React.useState();

    const [error, setError] = React.useState();
    const [success, setSuccess] = React.useState();
    const [waiting, setWaiting] = React.useState(false);

    const { web3Connected,alcaBalance, madAllowance } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        madAllowance: state.application.allowances.mad,
        alcaBalance: state.application.balances.alca
    }));

    const initiateMigrate = async () => {
        setWaiting(true)
        let tx = await ethAdapter.sendMigrateRequest(String(migrateAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            setMigrateAmount(0);
            return;
        }
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        setWaiting(false);
    }

    return (
        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                After granting allowance to the contract you can proceed with exchanging your MadTokens for ALCA tokens
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2">Amount of MadTokens to swap</Header>
                <Input
                    className=""
                    disabled={!web3Connected}
                    placeholder="0"
                    value={migrateAmount}
                    action={{
                        content: "Max",
                        secondary: true,
                        size: "mini",
                        onClick: () => setMigrateAmount(madAllowance),
                        disabled: !web3Connected
                    }}
                />
            </div>

            <div className="flex flex-row text-xs w-[314px] justify-between">
                <div>
                    Mad Allowance: {madAllowance}
                </div>
                <div>
                    |
                </div>
                <div>
                    ALCA Balance: {alcaBalance}
                </div>
            </div>


            <div>
                <Button
                    size="small"
                    content='Exchange'
                    className="relative left-[2px] mt-4 w-[318px]"
                    disabled={!web3Connected}
                    onClick={initiateMigrate}
                />
            </div>

        </Container>
    );
}
