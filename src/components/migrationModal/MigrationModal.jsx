import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Header, Icon, Modal, Message } from "semantic-ui-react";
import ethAdapter from "eth/ethAdapter";
import * as ACTIONS from 'redux/actions/application';
import { TOKEN_TYPES } from "redux/constants";
import { ethers } from "ethers";

export function MigrationModal({ migrationAmount, isOpen, successAction, closeModal }) {

    console.log(isOpen)

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
    const migrationAmtBN = ethers.BigNumber.from(migrationAmount ? migrationAmount : 0);

    // 1 = allow, 2 = swap
    const migrationStep = madAllowanceBN.gte(migrationAmtBN) ? 2 : 1;

    console.log({
        web3Connected: web3Connected,
        madAllowance: madAllowance,
        alcaBalance: alcaBalance,
        alcaExchangeRate: alcaExchangeRate,
        madBalance: madBalance,
        migrationAmount: migrationAmount,
        migrationStep: migrationStep,
        migrationSuccess: migrationSuccess
    })

    // NOTE: User must send additional allowance request if allowance < desired migration amount
    const sendAllowanceReq = async () => {
        setWaiting(WAIT_TYPES.ALLOWANCE)
        let tx = await ethAdapter.sendAllowanceRequest(String(migrationAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            return;
        }
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        setLatestTxHash(tx.hash);
        dispatch(ACTIONS.updateApprovalHash(tx.hash))
        dispatch(ACTIONS.updateBalances(TOKEN_TYPES.ALL))
        setWaiting(false);
    }

    // Should onyl be set of allowance >= migrationAmount
    const initiateMigrate = async () => {
        setWaiting(WAIT_TYPES.MIGRATION)
        let tx = await ethAdapter.sendMigrateRequest(String(migrationAmount));
        if (tx.error) {
            setError(tx.error);
            setWaiting(false);
            return;
        }
        await tx.wait();
        setSuccess("Tx Mined: " + tx.hash);
        setWaiting(false);
        setLatestTxHash(tx.hash);
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
            You have successfully migrated {migrationAmount} MAD {"=>"} {alcaExchangeRate}. <br />
            Click the Summary button below to view a summary of your migration.
        </div>
    )

    const successLink = () => (
        <div
            onMouseOver={() => setHovered(prevState => !prevState)}
            onMouseLeave={() => setHovered(prevState => !prevState)}
            className="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 h-6"
            onClick={() => window.open("https://etherscan.io/tx/" + latestTxHash, '_blank').focus()}
        >
            {latestTxHash}
            {hovered && <Icon name="external" className="m-0 h-full" />}
        </div>
    )

    return (
        <Modal closeIcon size="small" open={isOpen} onClose={() => { closeModal(); setError(false); setSuccess(false); }}>

            <Modal.Header>
                <div>Migrate {migrationAmount} MAD {"=>"} {alcaExchangeRate} ALCA</div>
            </Modal.Header>

            <Modal.Content>

                {!migrationSuccess && (migrationStep === 1 ? <AllowStep /> : <MigrateStep />)}

                {migrationSuccess && <SuccessMsg />}

                <div className="absolute left-0 top-[100%]">
                    <Message
                        size="mini"
                        content={successLink || error}
                        success={success.length > 0}
                        error={error}
                        className="mt-4"
                        hidden={!success && !error}
                    />
                </div>

            </Modal.Content>

            <Modal.Actions className="flex justify-between">

                <div>
                    <Button size="small"
                        disabled={migrationStep === 2 || migrationSuccess}
                        onClick={sendAllowanceReq}
                        loading={waiting === WAIT_TYPES.ALLOWANCE}
                        content={
                            <div>
                                Step 1 - Allow <Icon name={migrationStep == 2 || migrationSuccess ? "check" : "square outline outline-none"} />
                            </div>
                        }
                    />

                    <Button size="small"
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

                <Button
                    disabled={!migrationSuccess}
                    content="View Summary"
                    color={migrationSuccess ? "green" : "gray"}
                    onClick={successAction}
                />



            </Modal.Actions>

        </Modal>
    );

}
