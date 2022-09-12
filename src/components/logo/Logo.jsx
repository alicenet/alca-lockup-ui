import React, { useContext } from "react";
import AliceNetIcon from "assets/AliceNetSvg";

export function Logo({ className = "" }) {

    return (
        <div className={className}>
            <AliceNetIcon />
        </div>
    );
}