import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const TWITTER_URL = process.env.REACT_APP_TWITTER_URL;
const DISCORD_URL = process.env.REACT_APP_DISCORD_URL;

export function Footer() {

    return (

        <div className="fixed left-0 bottom-0 w-full bg-white flex p-4 justify-between">
            <div>
                Follow us on:&nbsp;
                <Icon
                    name="twitter"
                    className="cursor-pointer"
                    onClick={() => window.open(TWITTER_URL, '_blank').focus()}
                />
                <Icon
                    name="discord"
                    className="cursor-pointer"
                    onClick={() => window.open(DISCORD_URL, '_blank').focus()}
                />
            </div>
            <div className="cursor-pointer gap-6 hidden md:flex">
                <Link to="/about">About</Link>
                <Link to="/legal">Legal</Link>
                <Link to="/tos">Terms of Service</Link>
                <Link to="/">Alicenet Inc &copy; 2022</Link>
            </div>
        </div>

    );

}