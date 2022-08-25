import React from "react";
import { useSelector } from "react-redux";
import { Image, Label, Loader, Popup } from "semantic-ui-react";
import aIcon from "assets/alicenet-logo.svg";
import { classNames } from "utils/generic";

export function BalanceStatus({ row }) {
    const { balances, loading } = useSelector(state => (
        {
            loading: state.application.balancesLoading,
            balances: state.application.balances
        }
    ));

    const BalanceLabel = ({ balanceType }) => (
        <Label size className="flex justify-start items-center ml-2 mr-2 h-10">
            <div className="text-gray-500 mr-2">{balanceType.toUpperCase()}</div>
            <div className="text-gray-700">{loading ? "" : balances[balanceType]} </div>
        </Label>
    )

    return (
        <div className="w-70 flex justify-end cursor-default">
            <div className={classNames("w-full flex justify-between h-24", { "flex-col": !row, "flex-row": row })}>
                <BalanceLabel balanceType={"mad"} />
                <BalanceLabel balanceType={"alca"} />
            </div>
        </div>
    );
}