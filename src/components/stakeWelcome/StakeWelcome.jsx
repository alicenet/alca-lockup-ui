import React from "react";
import { useSelector } from "react-redux";
import { Header, Grid, Checkbox, Segment, Button } from 'semantic-ui-react'
import { useCookies } from 'react-cookie';
import { useDispatch } from "react-redux";
import { APPLICATION_ACTIONS } from "redux/actions";
import { useNavigate } from "react-router";
import { setAgreeCookieTrue } from "redux/actions/application";

export function StakeWelcome({ stepForward }) {

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

    // Push forward if user cookie has been set or is set
    React.useEffect(() => {
        if (hasReadTerms && web3Connected) {
            stepForward();
        }
    }, [hasReadTerms, web3Connected])

    // Check for cookie if exists, dispatch update, 
    React.useEffect(() => {
        dispatch(APPLICATION_ACTIONS.checkAgreeCookieState(agreeCookie))
    }, [])

    const agreeAndContinue = () => {
        setAgreeCookie("agreed", true);
        dispatch(APPLICATION_ACTIONS.setAgreeStateTrue())
    }

    const updateCheckState = (checkType, bool) => {
        setCheckState(s => ({ ...s, [checkType]: bool }))
    }

    const stakeAll = checkState.stake1 && checkState.stake2 && checkState.stake3;
    const unstakeAll = checkState.unstake1 && checkState.unstake2 && checkState.unstake3;
    const allCheck = stakeAll && unstakeAll;

    const StakingAgreement = () => {

        const segmentDisabled = { disabled: stakeAll || !web3Connected }

        return (
            <Segment {...segmentDisabled} className="flex flex-col justify-between h-full">
                <div>
                    <Header>Staking Terms</Header>
                    <div>
                        <Checkbox {...segmentDisabled} checked={checkState.stake1} onChange={(e, data) => updateCheckState("stake1", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={checkState.stake2} onChange={(e, data) => updateCheckState("stake2", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={checkState.stake3} onChange={(e, data) => updateCheckState("stake3", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                </div>
                <div>
                    <Checkbox checked={stakeAll} label={stakeAll ? "Thanks!" : "Check all above boxes to continue"} />
                </div>
            </Segment>)
    }


    const UnstakingAgreement = () => {
        const segmentDisabled = { disabled: !stakeAll || unstakeAll }
        return (
            <Segment {...segmentDisabled} className="flex flex-col justify-between h-full">

                <div>
                    <Header>Unstaking Terms</Header>
                    <div>
                        <Checkbox {...segmentDisabled} checked={checkState.unstake1} onChange={(e, data) => updateCheckState("unstake1", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={checkState.unstake2} onChange={(e, data) => updateCheckState("unstake2", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                    <div className="mt-8">
                        <Checkbox {...segmentDisabled} checked={checkState.unstake3} onChange={(e, data) => updateCheckState("unstake3", data.checked)}
                            label="laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu" />
                    </div>
                </div>

                <div>
                    <Checkbox {...segmentDisabled} checked={unstakeAll} label={unstakeAll ? "Thanks!" : "Check all above boxes to continue"} />
                </div>

            </Segment>
        )
    }

    const FinalAgreement = () => {
        const segmentDisabled = { disabled: !stakeAll || !unstakeAll };
        return (
            <Segment {...segmentDisabled}>
                <Header>Summary</Header>
                <div className="flex justify-between items-center" >
                    <div>
                        <div className="">
                            <Checkbox {...segmentDisabled} onChange={(e, data) => updateCheckState("finalCheck", data.checked)}
                                label="I have read and agreed to all of the above terms and conditions"
                                checked={checkState.finalCheck}
                            />
                        </div>
                    </div>
                    <div attribute className="flex justify-end">
                        <Button disabled={!checkState.finalCheck || !allCheck} size="huge" content="Continue" onClick={agreeAndContinue} />
                    </div>
                </div>
            </Segment>)
    }

    return (
        <Grid padded>

            <Grid.Row className="min-h-[420px]">

                <Grid.Column width={8}>
                    <StakingAgreement />
                </Grid.Column>

                <Grid.Column width={8}>
                    <UnstakingAgreement />
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
