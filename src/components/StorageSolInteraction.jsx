import React from 'react';
import { Segment, Form, Header } from 'semantic-ui-react';
import { GlobalContext } from '../context'
import ethAdapter, { CONTRACT_NAMES } from '../eth/ethAdapter';

export default function StorageSolInteraction() {

    const [storedValue, setStoredValue] = React.useState('');
    const [updateVal, setUpdateVal] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const globalContext = React.useContext(GlobalContext);
    const connected = globalContext.web3Connected;

    const setValue = async () => {
        let asNum;

        try {
            asNum = parseInt(updateVal);
        } catch (ex) {
            return;
        }

        setLoader(true);
        let setTx = await ethAdapter._trySend(CONTRACT_NAMES.STORAGE, 'store', [asNum]);
        await setTx.wait();
        getValue();
    }

    const getValue = async () => {
        let storedValue = await ethAdapter._tryCall(CONTRACT_NAMES.STORAGE, 'retrieve');
        setStoredValue(storedValue);
        setUpdateVal('');
        setLoader(false);
    }

    React.useEffect(() => {
        if (connected) {
            getValue();
        }
    }, [connected]);

    return (

        <Segment attached>

            <div className="max-w-prose">

                <Header>
                    Storage.Sol Interaction Demo
                    <Header.Subheader>
                        For demo, verify network is set to Goerli and dotenv has been copied to .env
                    </Header.Subheader>
                </Header>

                <div className="w-80">

                    <Form size="mini">

                        <Form.Input
                            actionPosition="left"
                            action={{
                                color: "blue",
                                size: "mini",
                                content: "Stored Value",
                                onClick: getValue,
                                disabled: true,
                            }}
                            value={connected ? (storedValue) : "Not Connected"}
                            readOnly
                        />

                        <Form.Input
                            action={{
                                color: "blue",
                                size: "mini",
                                content: "Update Value",
                                onClick: setValue,
                                disabled: !connected,
                                loading: loader,
                            }}
                            placeholder="Must be a number!"
                            value={connected ? (updateVal) : "Not Connected"}
                            onChange={e => setUpdateVal(e.target.value)}
                        />

                    </Form>

                </div>

            </div>

        </Segment>

    )


}