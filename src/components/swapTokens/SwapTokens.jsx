import { Button, Container, Header, Icon, Input, Message } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useState } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import * as ACTIONS from "redux/actions/application";
import { MigrationModal } from "components/migrationModal/MigrationModal";
import { ethers } from "ethers";

export function SwapTokens() {

    const [migrateAmount, setMigrateAmount] = useState(null);
    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState(false);

    const [error, setError] = useState();
    const [success, setSuccess] = useState("");
    const [waiting, setWaiting] = useState(false);
    const { setActiveTabPane } = useContext(TabPanesContext);

    const { web3Connected, alcaBalance, madBalance, madAllowance, alcaExchangeRate } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        madAllowance: state.application.allowances.mad,
        alcaBalance: state.application.balances.alca,
        alcaExchangeRate: state.application.alcaExchangeRate,
        madBalance: state.application.balances.mad
    }));

    const updateMigrateAmt = (amt) => {
        setMigrateAmount(amt);
        dispatch(ACTIONS.updateExchangeRate(ethers.utils.parseEther(amt)));
    }

    // Called by modal on success to move forwards
    const successAction = () => {
        setModalOpen(false);
        setActiveTabPane(tabPanes.SUCCESS);
    }

    return (
        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm text-center">
                    After inputting the amount of tokens you wish to migrate you will be requested to sign two transactions with your web3 wallet.
                    <br /> <br />
                    Please follow the on screen instructions to complete the migration
                </div>

                <div className="text-left mt-8">
                    <Header sub className="mb-2">Amount of MadTokens to migrate</Header>
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
                            onClick: () => updateMigrateAmt(madBalance),
                            disabled: !web3Connected
                        }}
                    />
                </div>

                <div className="flex flex-row text-xs w-[314px] justify-between mt-2">
                    <div>
                        <span className="font-bold">Mad Balance:</span> {Number(madBalance).toLocaleString()}
                    </div>
                    <div className="font-bold">
                        |
                    </div>
                    <div>
                        <span className="font-bold">ALCA Balance:</span> {Number(alcaBalance).toLocaleString()}
                    </div>
                </div>

                <div>
                    <Button
                        primary
                        size="small"
                        content={
                            <div className="m-4">
                                <div>
                                    Start Migration
                                </div>
                                {migrateAmount ? Number(migrateAmount).toLocaleString() : 0} MAD
                                <Icon name="arrow circle right ml-2 mr-2 mt-4" />
                                {typeof (alcaExchangeRate) !== 'object' ? Number(alcaExchangeRate).toLocaleString() : "0"} ALCA
                            </div>}
                        className="relative left-[2px] mt-4 min-w-[318px] p-2"
                        disabled={!web3Connected || migrateAmount < 1 || !alcaExchangeRate}
                        onClick={() => setModalOpen(true)}
                        loading={waiting}
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

            </Container>

            <MigrationModal isOpen={modalOpen} migrationAmount={migrateAmount} successAction={successAction} closeModal={() => setModalOpen(false)} />

        </>

    );
}
