import React, { useContext } from "react";
import { DarkThemeContext } from "contexts";
import AliceNetIcon from "assets/AliceNetSvg";

export function Logo({ className = "" }) {

    const { isDark } = useContext(DarkThemeContext);

    return (
        <div className={className}>
            <AliceNetIcon />
        </div>
    );
}