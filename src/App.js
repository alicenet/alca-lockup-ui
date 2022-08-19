import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { About, SwapActions, StakeActions, Footer, Header, TOS } from "components";
import { TabPanesProvider } from "context";
import { useSelector } from "react-redux";

function App() {

    const state = useSelector(state => state);
    React.useEffect(() => {

        const debugPrint = (ev) => {
            if (ev.keyCode === 68) {
                console.log("Debug Printout:", state);
                return;
            }
        }

        document.addEventListener("keydown", debugPrint);

        return () => {
            document.removeEventListener("keydown", debugPrint);
        }

    })


    const DefaultRoutes = () => {
        return (
            <>
                <Route exact path="/" element={<SwapActions />} />
                <Route exact path="/swap" element={<SwapActions />} />
                <Route exact path="/stake" element={<StakeActions />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/tos" element={<TOS />} />
            </>
        );
    };

    return (

        <Container fluid>

            <BrowserRouter>

                <Header />

                <TabPanesProvider>

                    <Routes>

                        {DefaultRoutes()}

                    </Routes>

                </TabPanesProvider>

                <Footer />

            </BrowserRouter>

        </Container>

    );
}

export default App;
