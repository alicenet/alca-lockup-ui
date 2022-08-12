import React from 'react';
import { Button } from 'semantic-ui-react';
import { GlobalContext, dispatchActions } from '../context'

export default function ToggleDebugModeButton() {

    const globalContext = React.useContext(GlobalContext);

    const toggle = () => {
        globalContext.dispatch(dispatchActions.toggleDebugModeDispatchObject(!globalContext.debugMode))
    }

    return (

        <Button size="small"
            content={"DebugMode: " + globalContext.debugMode}
            onClick={toggle}
        />

    )

}