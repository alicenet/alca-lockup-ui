import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Grid, Segment, Button, Checkbox } from "semantic-ui-react";
import { useCookies } from "react-cookie";
import { APPLICATION_ACTIONS } from "redux/actions";

export function LockupWelcome({stepForward}) {

    const [agreeCookie, setAgreeCookie] = useCookies(['agreed']);
    const dispatch = useDispatch();

    const { web3Connected, hasReadTerms } = useSelector(s => ({
        web3Connected: s.application.web3Connected,
        hasReadTerms: s.application.hasReadTerms
    }))

    const [checkState, setCheckState] = React.useState({
        stake1: false,
        stake2: false,
        stake3: false,
        unstake1: false,
        unstake2: false,
        unstake3: false,
        finalCheck: false,
    })
    React.useEffect(() => {
        // TODO Remove
        if(process.env.REACT_APP__MODE === "TESTING"){
            dispatch(APPLICATION_ACTIONS.setStakedPosition(500,1,0,0));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
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

    const agreeAndContinue = () => {
        setAgreeCookie("agreed", true);
        dispatch(APPLICATION_ACTIONS.setAgreeStateTrue())
    }
    const updateCheckState = (checkType, bool) => {
        setCheckState(s => ({ ...s, [checkType]: bool }))
    }
    const lockupAll = agreeCookie?.agreed || (checkState.stake1 && checkState.stake2 && checkState.stake3);
    const unlockAll = checkState.unstake1 && checkState.unstake2 && checkState.unstake3;
    const allCheck = lockupAll && unlockAll;

    const LockupAgreement = () => {

        const segmentDisabled = { disabled: Boolean(lockupAll) };

        return (
            <Segment {...segmentDisabled} className="flex flex-col justify-between h-full">
                <div>
                    <Header>Lockup Terms</Header>
                    <div>
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.stake1)} onChange={(e, data) => updateCheckState("stake1", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.stake2)} onChange={(e, data) => updateCheckState("stake2", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.stake3)} onChange={(e, data) => updateCheckState("stake3", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                </div>
                <div>
                    <Checkbox checked={Boolean(lockupAll)} label={lockupAll ? "Thanks!" : "Check all above boxes to continue"} />
                </div>
            </Segment>)
    }

    const UnlockAgreement = () => {
        const segmentDisabled = { disabled: Boolean(agreeCookie?.agreed || !lockupAll || unlockAll) }
        return (
            <Segment {...segmentDisabled} className="flex flex-col justify-between h-full">

                <div>
                    <Header>Unstaking Terms</Header>
                    <div>
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.unstake1)} onChange={(e, data) => updateCheckState("unstake1", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.unstake2)} onChange={(e, data) => updateCheckState("unstake2", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || checkState.unstake3)} onChange={(e, data) => updateCheckState("unstake3", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                </div>

                <div>
                    <Checkbox {...segmentDisabled} checked={Boolean(agreeCookie?.agreed || unlockAll)} label={unlockAll ? "Thanks!" : "Check all above boxes to continue"} />
                </div>

            </Segment>
        )
    }

    const FinalAgreement = () => {
        const segmentDisabled = { disabled: Boolean(agreeCookie?.agreed || !lockupAll || !unlockAll) };
        return (
            <Segment {...segmentDisabled}>
                <Header>Summary</Header>
                <div className="flex justify-between items-center" >
                    <div>
                        <div>
                            <Checkbox {...segmentDisabled} onChange={(e, data) => updateCheckState("finalCheck", data.checked)}
                                label="I have read and agreed to all of the above terms and conditions"
                                checked={Boolean(agreeCookie?.agreed || checkState.finalCheck)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={Boolean(!checkState.finalCheck || !allCheck)} size="huge" content="Continue" onClick={agreeAndContinue} />
                    </div>
                </div>
            </Segment>)
    }

    const termsAndConditions = () => {
        return (
            <Grid padded>

            <Grid.Row className="min-h-[420px]">

                <Grid.Column width={8}>
                    <LockupAgreement />
                </Grid.Column>

                <Grid.Column width={8}>
                    <UnlockAgreement />
                </Grid.Column>

            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={16}>
                    <FinalAgreement />
                </Grid.Column>
            </Grid.Row>

        </Grid>
        )
    }
    const welcomeScreen = () => {
        return (
            <Grid padded>
            <Header>Welcome to AliceNet Lockups</Header>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</div>

        </Grid>    
        )
    }
    
    return (
        hasReadTerms ? welcomeScreen() : termsAndConditions() 
    )

}
