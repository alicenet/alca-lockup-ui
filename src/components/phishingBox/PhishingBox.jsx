import { Button, Container } from "semantic-ui-react";
import React, { useContext, useState } from "react";
import config from "utils";
import { TabPanesContext } from "context";

export function PhishingBox() {

    const [success, setSuccess] = useState(false);
    const { setActiveTabPane } = useContext(TabPanesContext);
    const { generic, constants } = config;

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div
                className="text-sm text-center"
                onClick={() => {
                    setSuccess(true)
                }}
            >
                Prior to migration, an allowance of tokens to spend must be granted to the ALCA contract <br />
            </div>

            <div className="absolute right-0 top-[105%]">
                <Button
                    color="green"
                    content="Continue"
                    className={generic.classNames(
                        { 'hidden': !success }
                    )}
                    onClick={() => setActiveTabPane(constants.tabPanes.CONNECT)}
                />
            </div>

        </Container>

    );
}
