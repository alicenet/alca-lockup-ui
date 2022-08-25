import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

/* Styles */
import "semantic-ui-css/semantic.min.css";
import "./style/index.css";


// Alice overwrite style
import "alice-semantic-css";

// Toast styles
import 'react-toastify/dist/ReactToastify.css';

/* Redux Store */
import store from "redux/store/store.js";
import { Provider } from "react-redux";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
