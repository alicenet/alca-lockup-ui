import React, { createContext, useState } from "react";
import { tabPanes } from "utils/constants";

export const TabPanesContext = createContext(null);

/**
 * Provides the ability toolbar select an active tab pane
 * @param {*} props
 * @returns - Wrapped component with the respective context provider
 */
export const TabPanesProvider = (props) => {

    const [activeTabPane, setActiveTabPane] = useState(tabPanes.INTRO.index);

    const handleSetActiveTabPane = tabPane => setActiveTabPane(tabPane.index);

    return (
        <TabPanesContext.Provider value={{
            activeTabPane,
            setActiveTabPane: handleSetActiveTabPane,
        }}>
            {props.children}
        </TabPanesContext.Provider>
    );

}
