import { Container, Label } from "semantic-ui-react";
import React, { useContext } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import { useSelector } from "react-redux";
import { BalanceStatus } from "components/balanceStatus/BalanceStatus";

export function Success() {

    const { activeTabPane, setActiveTabPane } = useContext(TabPanesContext);

    const { alcaBalance, madBalance, approvalHash, migrationHash } = useSelector(state => ({
        approvalHash: state.application.approvalHash,
        migrationHash: state.application.migrationHash,
        alcaBalance: state.application.balances.alca,
        madBalance: state.application.balances.mad
    }))

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px] text-sm">

            <div
                className="text-sm text-center"
            >
                <div className="text-xl">
                Thank you for migrating to ALCA <br /> <br />
                </div>
                <span className="underline">
                Your current balances and recent transactions are noted below
                    </span>
            </div>

            <div className="flex justify-between  mt-8">
                <BalanceStatus/>
            </div>

            <div className="py-8">
                <b>Approval Hash:</b> {approvalHash ? (<a target="_blank" rel="noopener noreferrer"
                    href={`https://etherscan.io/tx/${approvalHash}`}> {approvalHash} </a>) : "N/A"}
                <br /><br />
                <b>Migration Hash:</b> {migrationHash ? (<a target="_blank" rel="noopener noreferrer"
                    href={`https://etherscan.io/tx/${migrationHash}`}> {migrationHash} </a>) : "N/A"}
            </div>

            <div>
                Navigate to <a target="_blank" rel="noopener noreferrer" className="text-blue-500 underline"
                    href="https://alice.net"> alice.net</a> to learn more, or <span className="text-blue-500 underline cursor-pointer" onClick={() => setActiveTabPane(tabPanes.MIGRATE)}>migrate more tokens</span>
            </div>

        </Container>

    );
}
