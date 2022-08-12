import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { Footer, Header, ActionTabs, About, TOS } from 'components';

function App() {

    const DefaultRoutes = () => {
        return (<>
            <Route exact path="/" element={<ActionTabs/>} />
            <Route exact path="/about" element={<About/>} />
            <Route exact path="/tos" element={<TOS/>} />

        </>)
    }

    return (

        <Container fluid>

            <BrowserRouter>

                <Header />
                <Routes>
                    {DefaultRoutes()}
                </Routes>
                <Footer/>

            </BrowserRouter>

        </Container>

    );
}

export default App;
