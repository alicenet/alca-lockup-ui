import { Container } from "semantic-ui-react";
import React, { useContext } from "react";
import { tabPanes } from "utils/constants";
import { TabPanesContext } from "context";

export function Success() {

    const { setActiveTabPane } = useContext(TabPanesContext);

    return (

        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div
                className="text-sm text-center"
                onClick={() => setActiveTabPane(tabPanes.PHISHING)}
            >
                Thanks for migrating to ALCA
            </div>

        </Container>

    );
}
