import { Container, Label } from "semantic-ui-react";
import React, { useContext } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "context";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
                Your current balances and recent transactions are noted below:
            </div>

            <div>
                <Label color="blue" size="large" as='a' image>
                    <div>MAD: {madBalance}</div>
                </Label>
                <Label color="blue" size="large" as='a' image>
                    <div>ALCA: {alcaBalance}</div>
                </Label>
            </div>

            <div>
                Approval Hash: {approvalHash ? (<a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${approvalHash}`}> {approvalHash} </a>) : "N/A"} <br/>
                Migration Hash: {migrationHash ? (<a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${migrationHash}`}> {migrationHash} </a>) : "N/A"}
            </div>

            <div>
                You can now navigate to <a target="_blank" rel="noopener noreferrer" href="https://alice.net"> alice.net</a> to learn more
            </div>

        </Container>

    );
}
