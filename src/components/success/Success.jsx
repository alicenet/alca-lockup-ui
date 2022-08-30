import { Button, Container, Header } from "semantic-ui-react";
import React, { useContext } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import { useSelector } from "react-redux";
import { BalanceStatus } from "components/balanceStatus/BalanceStatus";
import { MigrationPanel } from "components/migrationPanel/MigrationPanel";
import { Link } from "react-router-dom";

export function Success() {

    const { activeTabPane, setActiveTabPane } = useContext(TabPanesContext);

    const { alcaBalance, madBalance, approvalHash, migrationHash, migrationAmount, alcaExchangeRate, prevMadBal, prevAlcaBal } = useSelector(state => ({
        approvalHash: state.application.approvalHash,
        migrationHash: state.application.migrationHash,
        prevAlcaBal: state.application.startingBalances.alca,
        alcaBalance: state.application.balances.alca,
        prevMadBal: state.application.startingBalances.mad,
        madBalance: state.application.balances.mad,
        migrationAmount: state.application.migrationAmount,
        alcaExchangeRate: state.application.alcaExchangeRate,
    }))

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px] text-sm">

            <div
                className="text-sm text-center"
            >
                <div className="text-xl">
                    <div className="text-sm mb-2">
                        Thank you for migrating to ALCA
                    </div>
                    <div className="font-bold">
                        You have migrated {migrationAmount} MAD to {Number(alcaExchangeRate).toLocaleString(false, { maximumFractionDigits: 2 })} ALCA
                    </div>
                </div>
            </div>

            <div className="flex justify-between  mt-8">
                <MigrationPanel preTextHeader="Previous Balance" postTextHeader="Current Balance" quadrants={[
                    { title: "MAD Balance", value: Number(prevMadBal).toLocaleString(false, { maximumFractionDigits: 2 }), valueName: "MAD" },
                    { title: "ALCA Balance", value: Number(prevAlcaBal).toLocaleString(false, { maximumFractionDigits: 2 }), valueName: "ALCA" },
                    { title: "MAD Balance", value: Number(madBalance).toLocaleString(false, { maximumFractionDigits: 2 }), valueName: "MAD" },
                    { title: "ALCA Balance", value: Number(alcaBalance).toLocaleString(false, { maximumFractionDigits: 2 }), valueName: "ALCA" }
                ]} hideButton hideInput disableLeft />
            </div>

            <div className="py-8">
                <b>Approval Hash:</b> {approvalHash ? (<a target="_blank" rel="noopener noreferrer"
                    href={`https://etherscan.io/tx/${approvalHash}`}> {approvalHash} </a>) : "N/A"}
                <br /><br />
                <b>Migration Hash:</b> {migrationHash ? (<a target="_blank" rel="noopener noreferrer"
                    href={`https://etherscan.io/tx/${migrationHash}`}> {migrationHash} </a>) : "N/A"}
            </div>

            <div className="flex justify-between min-w-[420px]">
                <div>
                    <Button secondary as={"a"} content="Visit alice.net" target="_blank" rel="noopener noreferrer" href="https://alice.net" />
                </div>
                <div>
                    <Button secondary content="Migrate More Tokens" onClick={() => setActiveTabPane(tabPanes.MIGRATE)} />
                </div>
            </div>

        </Container>

    );
}
