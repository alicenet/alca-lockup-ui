import React from "react";
import { useSelector } from "react-redux";
import { Connect } from "components/connect/Connect";

export function LockupWelcome({ stepForward }) {
    const { web3Connected } = useSelector(s => ({
        web3Connected: s.application.web3Connected
    }))

    // Push when connected
    React.useEffect( () => {
        if (web3Connected) {
            stepForward();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3Connected])

    const welcomeScreen = () => {
        return (
            <div className="flex justify-center items-center w-full"> 
                <Connect />
            </div>
        )
    }

    return (
        welcomeScreen()
    )
}
