import React from 'react';
import { useSelector } from 'react-redux';
import { Image, Label, Loader, Popup } from 'semantic-ui-react';
// import ethIcon from 'assets/eth-diamond-purple.png';
import aIcon from 'assets/alicenet-logo.svg';

export function BalanceStatus() {
    const { balances, loading } = useSelector(state => ({ loading: state.application.balancesLoading, balances: state.application.balances }));

    return (
        <div className="w-70 flex justify-end cursor-default">
            <Popup size="mini" position="bottom left" offset={[0, 4]}
                content="These are your token balances"
                trigger={
                    <div className="flex">
                        <Label size="mini" className="flex justify-start items-center w-28 mr-2">
                            {loading ? (
                                <Loader className="extra-small-balance-loader" size="mini" active inline />
                            ) : (
                                <span>
                                    <Image inline size="mini" src={aIcon} className="w-2 mr-2" />
                                </span>
                            )}
                            <span className="text-gray-700">{loading ? "" : balances.alca} <span className="ml-2 text-gray-500">ETH</span> </span>
                        </Label>
                    </div>
                }
            />
        </div >
    )
}