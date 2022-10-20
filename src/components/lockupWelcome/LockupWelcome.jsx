import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { Connect } from "components/connect/Connect";

export function LockupWelcome({ stepForward }) {

    const dispatch = useDispatch();

    const { web3Connected, hasReadTerms } = useSelector(s => ({
        web3Connected: s.application.web3Connected,
        hasReadTerms: s.application.hasReadTerms
    }))

    // Push when connected
    React.useEffect( () => {
        if (web3Connected) {
            stepForward();
        }
    }, [web3Connected])

    React.useEffect(() => {
        if (process.env.REACT_APP__MODE === "TESTING") {
            dispatch(APPLICATION_ACTIONS.setStakedPosition(500, 1, 0, 0));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
