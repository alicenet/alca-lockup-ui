import { Button, Container, Header, Icon, Input, Message, Segment } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useState } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import * as ACTIONS from "redux/actions/application";
import { ethers } from "ethers";
import { MigrationPanel, MigrationModal } from "components";

export function SwapTokens() {

    const [migrateAmount, setMigrateAmount] = useState(null);
    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState(false);

    const { setActiveTabPane } = useContext(TabPanesContext);

    const { web3Connected, alcaBalance, madBalance, alcaExchangeRate } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        alcaBalance: state.application.balances.alca,
        alcaExchangeRate: state.application.alcaExchangeRate,
        madBalance: state.application.balances.mad
    }));

    const updateMigrateAmt = (amt) => {
        if (amt === "." || amt === "") {
            return setMigrateAmount("");
        }
        if (!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(amt)) {
            return;
        }
        let split = amt.split(".");
        if (split[0].length >= 10 || (split[1] && split[1].length > 18)) {
            return
        }
        setMigrateAmount(amt);
        dispatch(ACTIONS.updateExchangeRate(ethers.utils.parseEther(amt)));
    }

    // Update prev balance states here
    const openMigrationModal = () => {
        dispatch(ACTIONS.updateStartingBalances(madBalance, alcaBalance));
        dispatch(ACTIONS.updateMigrationAmount(migrateAmount));
        setModalOpen(true)
    }

    // Called by modal on success to move forwards
    const successAction = () => {
        setModalOpen(false);
        setActiveTabPane(tabPanes.SUCCESS);
    }


    return (
        <>

            <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

                <div className="text-sm text-center mb-4">
                    Migrating your tokens requires signing two transactions with your web3 wallet
                    <br /> <br />
                    Please follow the on screen instructions to complete the migration
                </div>

                <MigrationPanel preTextHeader="Before Migration" postTextHeader="After Migration" quadrants={[
                    { title: "Current MAD Balance", value: Number(madBalance).toLocaleString(false, { maximumFractionDigits: 4 }), valueName: "MAD" },
                    { title: "Current ALCA Balance", value: Number(alcaBalance).toLocaleString(false, { maximumFractionDigits: 4 }), valueName: "ALCA" },
                    { title: "Future MAD Balance", value: (Number(madBalance) - Number(migrateAmount ? migrateAmount : 0)).toLocaleString(false, {maximumFractionDigits: 4}), valueName: "MAD" },
                    { title: "Future ALCA Balance", value: (Number(alcaBalance) + Number(migrateAmount ? alcaExchangeRate : 0)).toLocaleString(false, {maximumFractionDigits: 4}), valueName: "ALCA" }
                ]}
                    inputValue={migrateAmount}
                    inputOnChange={(e) => updateMigrateAmt(e.target.value)}
                    inputDisabled={!web3Connected}
                    inputBtnOnClick={(e) => updateMigrateAmt(madBalance)}
                    inputSubText={`Migrate ${Number(migrateAmount).toLocaleString(false, {maximumFractionDigits: 4})} MAD to ${Number(alcaExchangeRate).toLocaleString(false, {maximumFractionDigits: 4})} ALCA`}
                    buttonOnClick={openMigrationModal}
                    buttonDisabled={!web3Connected || migrateAmount < 1 || !alcaExchangeRate}
                />

            </Container>

            <MigrationModal isOpen={modalOpen} migrationAmount={migrateAmount} successAction={successAction} closeModal={() => setModalOpen(false)} />

        </>

    );
}
