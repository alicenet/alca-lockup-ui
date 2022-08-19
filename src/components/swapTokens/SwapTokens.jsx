import { Button, Container, Header, Input, Message } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useState } from "react";
import ethAdapter from "eth/ethAdapter";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import * as ACTIONS from "redux/actions/application";
import { TOKEN_TYPES } from "redux/constants";

export function SwapTokens() {

    const [migrateAmount, setMigrateAmount] = useState(0);
    const dispatch = useDispatch();

    const [error, setError] = useState();
    const [success, setSuccess] = useState("");
    const [waiting, setWaiting] = useState(false);
    const { setActiveTabPane } = useContext(TabPanesContext);

    const { web3Connected, alcaBalance, madAllowance, alcaExchangeRate } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        madAllowance: state.application.allowances.mad,
        alcaBalance: state.application.balances.alca,
        alcaExchangeRate: state.application.alcaExchangeRate
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
        dispatch(ACTIONS.updateMigrationHash(tx.hash))
        dispatch(ACTIONS.updateBalances(TOKEN_TYPES.ALL))
        setActiveTabPane(tabPanes.SUCCESS)
    }

    const updateMigrateAmt = (amt) => {
        dispatch(ACTIONS.updateExchangeRate(amt));
        setMigrateAmount(amt);
    }

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                After granting allowance to the contract you can proceed with exchanging your MadTokens for ALCA tokens
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2">Amount of MadTokens to swap</Header>
                <Input
                    disabled={!web3Connected}
                    placeholder="0"
                    value={migrateAmount}
                    onChange={(e) =>
                        updateMigrateAmt(e.target.value)

                    }
                    action={{
                        content: "Max",
                        secondary: true,
                        size: "mini",
                        onClick: () => updateMigrateAmt(madAllowance),
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
                    content={`Migrate for ~${typeof (alcaExchangeRate) !== 'object' ? alcaExchangeRate : "0"} ALCA*`}
                    className="relative left-[2px] mt-4 w-[318px]"
                    disabled={!web3Connected || migrateAmount < 1}
                    onClick={initiateMigrate}
                    loading={waiting}
                />
            </div>

            <div className="text-center text-xs mt-4">
                This is an approximate amount of tokens based on the current conversion rate.<br/> 
                It is <b>not</b> guaranteed at transaction execution time
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

        </Container>

    );
}
