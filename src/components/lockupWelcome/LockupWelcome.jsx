import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Grid, Segment, Button } from "semantic-ui-react";
import { useCookies } from "react-cookie";
import { APPLICATION_ACTIONS } from "redux/actions";

export function LockupWelcome({stepForward}) {

    const [agreeCookie, setAgreeCookie] = useCookies(['agreed']);
    const dispatch = useDispatch();

    const { web3Connected, hasReadTerms } = useSelector(s => ({
        web3Connected: s.application.web3Connected,
        hasReadTerms: s.application.hasReadTerms
    }))

    // Push forward if user cookie has been set or is set
    React.useEffect(() => {
        if (hasReadTerms && web3Connected) {
            stepForward();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasReadTerms, web3Connected])

    // Check for cookie if exists, dispatch update, 
    React.useEffect(() => {
        dispatch(APPLICATION_ACTIONS.checkAgreeCookieState(agreeCookie));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(web3Connected){
        stepForward()
    }
    return (
        <Grid padded>
            <Header>Welcome to AliceNet Lockups</Header>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</div>

        </Grid>
    )

}
