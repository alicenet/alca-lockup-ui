import { Button, Container, Header, Input, Message } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useState } from "react";
import ethAdapter from "eth/ethAdapter";
import config from "utils";
import { TabPanesContext } from "contexts";
import { ethers } from "ethers";
import * as ACTIONS from 'redux/actions/application';
import { TOKEN_TYPES } from "redux/constants";

export function AllowTokens() {

    const { setActiveTabPane } = useContext(TabPanesContext);
    const [allowanceAmount, setAllowanceAmount] = useState();
    const [error, setError] = useState();
    const [success, setSuccess] = useState("");
    const [waiting, setWaiting] = useState(false);
    const dispatch = useDispatch();

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
        dispatch(ACTIONS.updateApprovalHash(tx.hash))
        dispatch(ACTIONS.updateBalances(TOKEN_TYPES.ALL))
        setWaiting(false);
    }


    return (
        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                Prior to migration, an allowance of tokens to spend must be granted to the ALCA contract <br />
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2" content="MadTokens to allow" />
                <Input
                    disabled={!web3Connected}
                    placeholder="0x0"
                    value={allowanceAmount}
                    onChange={(e) =>
                        setAllowanceAmount(e.target.value)
                    }
                    action={{
                        disabled: !web3Connected,
                        content: "All",
                        secondary: true,
                        onClick: () => setAllowanceAmount(madBalance)
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
                    content="Approve"
                    className="relative left-[2px] mt-4 w-[318px]"
                    onClick={sendAllowanceReq}
                    loading={waiting}
                />
                <br />
                <Button
                    fluid
                    color="green"
                    content="Use Existing Allowance"
                    className={config.generic.classNames(
                        {
                            'hidden': success || !ethers.BigNumber.from(madAllowance).gte(ethers.BigNumber.from(1)),
                            "mt-4": true,
                        }
                    )}
                    onClick={() => setActiveTabPane(config.constants.tabPanes.MIGRATE)}
                />
            </div>

            <div className="absolute left-0 top-[100%]">
                <Message
                    size="mini"
                    content={success || error}
                    success={success.length > 0}
                    error={error}
                    className="mt-4"
                    hidden={!success && !error}
                />
            </div>

            <div className="absolute right-0 top-[105%]">
                <Button
                    color="green"
                    content="Continue"
                    className={config.generic.classNames(
                        { 'hidden': !success }
                    )}
                    onClick={() => setActiveTabPane(config.constants.tabPanes.MIGRATE)}
                />
            </div>

        </Container>
    );
}
