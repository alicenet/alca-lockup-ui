import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Header, Icon, Modal, Message, Popup } from "semantic-ui-react";
import ethAdapter from "eth/ethAdapter";
import * as ACTIONS from 'redux/actions/application';
import { TOKEN_TYPES } from "redux/constants";
import { ethers } from "ethers";
import { waitFor } from "utils/generic";

export function MigrationModal({ migrationAmount, isOpen, successAction, closeModal }) {

    const dispatch = useDispatch();

    const WAIT_TYPES = {
        ALLOWANCE: "allowance",
        MIGRATION: "migration"
    }

    // Success/Error/Waiting
    const [error, setError] = React.useState();
    const [success, setSuccess] = React.useState("");
    const [waiting, setWaiting] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [latestTxHash, setLatestTxHash] = React.useState(false);

    const [migrationSuccess, setMigrationSuccess] = React.useState(false);

    const { web3Connected, alcaBalance, madBalance, madAllowance, alcaExchangeRate } = useSelector(state => ({
        web3Connected: state.application.web3Connected,
        madAllowance: state.application.allowances.mad,
        alcaBalance: state.application.balances.alca,
        alcaExchangeRate: state.application.alcaExchangeRate,
        madBalance: state.application.balances.mad
    }));

    const madAllowanceBN = ethers.BigNumber.from(madAllowance ? madAllowance : 0);
    const migrationAmtBN = ethers.BigNumber.from(migrationAmount ? ethers.utils.parseEther(migrationAmount) : 0);

    // 1 = allow, 2 = swap
    const migrationStep = madAllowanceBN.gte(migrationAmtBN) ? 2 : 1;

    // console.log({
    //     web3Connected: web3Connected,
    //     madAllowance: madAllowance,
    //     madAllowanceBN: madAllowanceBN.toString(),
    //     alcaBalance: alcaBalance,
    //     alcaExchangeRate: alcaExchangeRate,
    //     madBalance: madBalance,
    //     migrationAmount: migrationAmount,
    //     migrationAmtBN: migrationAmtBN.toString(),
    //     migrationStep: migrationStep,
    //     migrationSuccess: migrationSuccess,
    //     error: error,
    //     success: success,
    //     latestTxHash: latestTxHash,
    //     waiting: waiting
    // })

    // NOTE: User must send additional allowance request if allowance < desired migration amount
    const sendAllowanceReq = async () => {
        setLatestTxHash(false);
        setSuccess(false);
        setError(false);
        setWaiting(WAIT_TYPES.ALLOWANCE)
        let tx = await ethAdapter.sendAllowanceRequest(String(migrationAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            return;
        }
        setLatestTxHash(tx.hash);
        await waitFor(2750, "txMining")
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        dispatch(ACTIONS.updateApprovalHash(tx.hash))
        dispatch(ACTIONS.updateBalances(TOKEN_TYPES.ALL))
        setWaiting(false);
    }

    // Should onyl be set of allowance >= migrationAmount
    const initiateMigrate = async () => {
        setLatestTxHash(false);
        setSuccess(false);
        setError(false);
        setWaiting(WAIT_TYPES.MIGRATION)
        let tx = await ethAdapter.sendMigrateRequest(String(migrationAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            return;
        }
        setLatestTxHash(tx.hash);
        waitFor()
        await waitFor(2750, "txMining")
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        setWaiting(false);
        dispatch(ACTIONS.updateMigrationHash(tx.hash))
        dispatch(ACTIONS.updateBalances(TOKEN_TYPES.ALL))
        setMigrationSuccess(true);
    }

    const AllowStep = () => (
        <div>
            Click the button for <b>Step 1</b> below to begin the migration process<br />
            You will be asked to sign a transaction for approval equal to the migration amount.
        </div>
    )


    const MigrateStep = () => (
        <div>
            Click the button for <b>Step 2</b> below to complete the migration process<br />
            You will be asked to sign a transaction to finish the migration.
        </div>
    )

    const SuccessMsg = () => (
        <div>
            You have successfully migrated {migrationAmount} MAD {"=>"} {alcaExchangeRate} ALCA. <br />
            Click the Summary button below to view a summary of your migration.
        </div>
    )

    const SuccessLink = ({pending}) => (
        <div
            className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 h-6"
            onClick={() => window.open("https://etherscan.io/tx/" + latestTxHash, '_blank').focus()}
        >
            <Popup
                content="View on Etherscan"
                position="top left"
                offset={[-13, 15]}
                size="mini"
                trigger={(<div className="text-sm">
                    {pending ? !latestTxHash ? "Awaiting Web3 Wallet": "Mining: " : "Tx Mined:"} {latestTxHash}
                    {latestTxHash && (
                        <Icon name="external" className="m-0 h-full absolute right-3 top-2.5" />
                    )}
                </div>)}
            />
        </div>
    )

    return (
        <Modal closeIcon={!migrationSuccess && !waiting} size="small" open={isOpen} closeOnDimmerClick={!migrationSuccess && !waiting}
            onClose={() => { closeModal(); setError(false); setSuccess(false); }}
        >

            <Modal.Header className="pt-[27px]">
                <div className="text-sm relative right-1 -top-3">
                    <Message
                        size="mini"
                        content={!!waiting ? (<SuccessLink pending={waiting}/>) : success ? <SuccessLink/> : error}
                        success={success.length > 0}
                        error={error}
                        warning={!!waiting}
                        className="mt-0"
                        hidden={!success && !error && !waiting}
                    />
                </div>
                <div>Migrate {migrationAmount} MAD {"=>"} {alcaExchangeRate} ALCA</div>
            </Modal.Header>

            <Modal.Content>

                {!migrationSuccess && (migrationStep === 1 ? <AllowStep /> : <MigrateStep />)}

                {migrationSuccess && <SuccessMsg />}

            </Modal.Content>

            <Modal.Actions className="flex justify-between">

                <div>
                    <Button size="small" primary
                        disabled={migrationStep === 2 || migrationSuccess}
                        onClick={sendAllowanceReq}
                        loading={waiting === WAIT_TYPES.ALLOWANCE}
                        content={
                            <div>
                                Step 1 - Allow <Icon name={migrationStep == 2 || migrationSuccess ? "check" : "square outline outline-none"} />
                            </div>
                        }
                    />

                    <Button size="small" primary
                        disabled={migrationStep === 1 || migrationSuccess}
                        className="ml-4"
                        content={
                            <div>
                                Step 2 - Migrate <Icon name={migrationSuccess ? "check" : "square outline outline-none"} />
                            </div>
                        }
                        loading={waiting === WAIT_TYPES.MIGRATION}
                        onClick={initiateMigrate}
                    />
                </div>

                <Button secondary
                    disabled={!migrationSuccess}
                    content="View Summary"
                    color={migrationSuccess ? "green" : "gray"}
                    onClick={successAction}
                />



            </Modal.Actions>

        </Modal>
    );

}
