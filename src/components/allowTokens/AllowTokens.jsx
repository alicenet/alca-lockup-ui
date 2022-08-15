import { Header, Container, Input, Button, Message } from "semantic-ui-react";
import { useSelector } from "react-redux";
import React from "react";
import ethAdapter from "eth/ethAdapter";

export function AllowTokens({setTabIdx}) {

    const [allowanceAmount, setAllowanceAmount] = React.useState();
    const [error, setError] = React.useState();
    const [success, setSuccess] = React.useState();
    const [waiting, setWaiting] = React.useState(false);

    const { web3Connected, madBalance, madAllowance } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        madBalance: state.application.balances.mad,
        madAllowance: state.application.allowances.mad,
    }));

    const sendAllowanceReq = async () => {
        setWaiting(true)
        let tx = await ethAdapter.sendAllowanceRequest(String(allowanceAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            setAllowanceAmount(0);
            return;
        }
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        setWaiting(false);
    }

    return (
        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                Prior to migration, an allowance of tokens to spend must be granted to the ALCA contract <br />
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2">MadTokens to allow</Header>
                <Input
                    className=""
                    disabled={!web3Connected}
                    placeholder="0x0"
                    value={allowanceAmount}
                    onChange={(e) => { setAllowanceAmount(e.target.value) }}
                    action={{
                        disabled: !web3Connected,
                        content: "All",
                        secondary: true,
                        onClick: () => { setAllowanceAmount(madBalance) }
                    }}
                />
            </div>

            <div className="flex flex-row text-xs w-[314px] justify-between">
                <div>
                    MadBalance: {madBalance}
                </div>
                <div>
                    |
                </div>
                <div>
                    MadAllowance: {madAllowance}
                </div>
            </div>

            <div>
                <Button
                    size="small"
                    disabled={!web3Connected || !allowanceAmount || allowanceAmount <= 1}
                    content='Approve'
                    className="relative left-[2px] mt-4 w-[318px]"
                    onClick={sendAllowanceReq}
                    loading={waiting}
                />
            </div>

            <div className="absolute left-0 top-[100%]">
                <Message
                    size="mini"
                    content={success || error}
                    success={success}
                    error={error}
                    className="mt-4"
                    hidden={!success && !error}
                />
            </div>

            <div className="absolute right-0 top-[105%]">
                <Button color="green"
                    content="Continue"
                    className={`${success ? "" : "hidden"}`}  
                    onClick={() => setTabIdx(1)}                  
                />
            </div>

        </Container>
    );
}
