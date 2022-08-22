import { Container, Label } from "semantic-ui-react";
import React, { useContext } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "contexts";
import { useSelector } from "react-redux";

export function Success() {

    const { setActiveTabPane } = useContext(TabPanesContext);

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
                onClick={() => setActiveTabPane(tabPanes.PHISHING)}
            >
                Thanks for migrating to ALCA. <br /> <br />
                <span className="underline">
                Your current balances and recent transactions are noted below
                    </span>
            </div>

            <div className="flex justify-between w-[320px] mt-8">
                <Label size="large" as='a' image>
                    <div>MAD: {madBalance}</div>
                </Label>
                <Label size="large" as='a' image>
                    <div>ALCA: {alcaBalance}</div>
                </Label>
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
                    href="https://alice.net"> alice.net</a> to learn more!
            </div>

        </Container>

    );
}
