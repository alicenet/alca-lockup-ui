import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { SwapActions, StakeActions, Footer, Header } from "components";
import { DarkThemeProvider, TabPanesProvider } from "contexts";

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
            </>
        )
    };

    return (

        <Container fluid className="">

            <BrowserRouter>

                <DarkThemeProvider>

                    <Header />

                    <div className="overflow-auto pb-[112px] ">

                        <TabPanesProvider>

                            <Routes>

                                {DefaultRoutes()}

                            </Routes>

                        </TabPanesProvider>
                    
                    </div>

                    <Footer />

                </DarkThemeProvider>

            </BrowserRouter>

        </Container>

    );
}

export default App;
