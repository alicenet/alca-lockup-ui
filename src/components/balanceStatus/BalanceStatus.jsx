import React from "react";
import { useSelector } from "react-redux";
import { Segment, Label, Loader, } from "semantic-ui-react";

export function BalanceStatus({ row }) {
    const { balances, loading } = useSelector(state => (
        {
            loading: state.application.balancesLoading,
            balances: state.application.balances
        }
    ));

    const BalanceLabel = ({ balanceType }) => (
        <div size className="flex flex-col justify-start items-start ml-2 mr-2 h-10 text-left">
            <div className="text-gray-500 text-xs font-bold">Current {balanceType.toUpperCase()} Balance</div>
            <div className="text-gray-700 text-xl mt-1">{loading ? <Loader size="small" active/> : Number(balances[balanceType]).toLocaleString(false, { maximumFractionDigits: 4 })} </div>
        </div>
    )

    return (
        <Segment color='blue' className="alice-segment-blue flex justify-between p-0 h-full w-full">
            <div className="w-full p-4 border-r-2 border-r-gray-200">
                <BalanceLabel balanceType={"mad"} />
            </div>
            <div className="w-full p-4 pb-5">
                <BalanceLabel balanceType={"alca"} />
            </div>
        </Segment>
    );

}