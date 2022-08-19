import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { About, ActionTabs, Footer, Header, TOS } from "components";
import { DarkThemeProvider, TabPanesProvider } from "contexts";

function App() {

    const DefaultRoutes = () => {
        return (
            <>
                <Route exact path="/" element={<ActionTabs />} />
                <Route exact path="/about" element={<About />} />
                <Route exact path="/tos" element={<TOS />} />
            </>
        );
    };

    return (

        <Container fluid>

            <BrowserRouter>

                <DarkThemeProvider>

                    <Header />

                    <TabPanesProvider>

                        <Routes>

                            {DefaultRoutes()}

                        </Routes>

                    </TabPanesProvider>

                    <Footer />

                </DarkThemeProvider>

            </BrowserRouter>

        </Container>

    );
}

export default App;
