import { React } from "react";
import { Header, Container, Button } from "semantic-ui-react";
import { useContext } from "react";
import { TabPanesContext } from "contexts/TabPanesContext";
import { tabPanes } from "utils/constants";

export function Introduction() {

    const { setActiveTabPane } = useContext(TabPanesContext);

    return (

        <div>

            <Header content="ALCA Swap Introduction" />

            <Container>
                This application is used to migrate your current MAD tokens to ALCA tokens.
                <br />
                Please read each step carefully to understand the application flow and what transactions you will need to sign.
                <br /> <br />
                After reading each step please press the button below to continue
            </Container>

            <Header content="Security Notification" as="h4" />
            <Container>You will be asked to verify information regarding application security to help prevent phishing.</Container>

            <Header content="Connect" as="h4" />
            <Container>To migrate tokens you will be asked to connect the wallet that has the MAD tokens you wish to migrate</Container>

            <Header content="Migrate" as="h4" />
            <Container>
                You will be asked the amount of MAD to migrate as well as requested to sign two transactions with your web3 wallet:
                <br /> <br />
                - The first transaction is to allow the ALCA contract to move your tokens
                <br />
                - The second transaction will migrate your tokens from MAD => ALCA
            </Container>

            <Header content="Success" as="h4" />
            <Container>
                This step will present you with your closing balances of MAD and ALCA tokens.
            </Container>

            <div className="absolute right-0 top-[100%]">
                <Button content="Continue" className="mt-4" color="green"
                    onClick={() => { setActiveTabPane(tabPanes.PHISHING) }} />
            </div>


        </div >

    )


}