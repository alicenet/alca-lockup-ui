import React from "react";
import { Menu } from "semantic-ui-react";
import { ReactComponent as AlicenetLogo } from "assets/alicenet-logo.svg";
import { Link } from "react-router-dom";

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const WHITE_PAPER_URL = process.env.REACT_APP_WHITE_PAPER_URL;

export function Header() {

    return (
        <Menu borderless className="top-0 left-0 bg-white w-full h-24 rounded-none">
            <Menu.Item className="items-center">
                <Link to="/">
                    <AlicenetLogo className="m-6 w-20" />
                </Link>
                <div className="hidden md:block">ALCA Swapping Interface</div>
            </Menu.Item>
            <Menu.Menu position="right" className="hidden md:flex">
                <Menu.Item
                    className="cursor-pointer"
                    onClick={() => window.open(GITHUB_URL, '_blank').focus()}
                    content="Github"
                />
                <Menu.Item
                    className="cursor-pointer"
                    onClick={() => window.open(WHITE_PAPER_URL, '_blank').focus()}
                    content="Whitepaper"
                />
                <Menu.Item
                    className="cursor-pointer"
                    onClick={() => window.open(WHITE_PAPER_URL, '_blank').focus()}
                    content="Community"
                />
            </Menu.Menu>
        </Menu>
    )
}