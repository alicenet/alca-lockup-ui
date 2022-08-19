import React from "react";
import { Menu, Header as SHeader } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "components";

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const WHITE_PAPER_URL = process.env.REACT_APP_WHITE_PAPER_URL;

export function Header() {

    const location = useLocation();

    return (
        <Menu borderless className="top-0 left-0 bg-white w-full h-24 rounded-none">
            <Menu.Item className="items-center">
                <Link to="/">
                    <Logo className="m-6 w-20" />
                </Link>
                <div className="hidden md:block">
                    <SHeader>
                        ALCA Interface
                    </SHeader>
                </div>
            </Menu.Item>

            <Menu.Item position="right" className="items-center" >

                <Menu.Item as={Link} to="/swap" active={location.pathname == "/" || location.pathname == "/swap"}>
                    MAD => ALCA Token Migration
                </Menu.Item>

                {/* <Menu.Item as={Link} to="/stake" active={location.pathname == "/stake"}>
                    Stake
                </Menu.Item> */}

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