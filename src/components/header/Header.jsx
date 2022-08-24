import React from "react";
import { Menu, Header as SHeader } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "components";
import { DarkThemeContext } from "contexts";
import { LINKS } from "utils/constants";

export function Header() {

    const { isDark, toggle } = React.useContext(DarkThemeContext);

    const location = useLocation();

    return (
        <Menu borderless className="top-0 left-0 bg-white w-full h-24 rounded-none sticky">
            <Menu.Item className="items-center">
                <Link to="/" className="m-6 w-20 flex justify-start items-start">
                    <Logo />
                </Link>
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
                    onClick={() => window.open(LINKS.GITHUB, '_blank').focus()}
                    content="Github"
                />
                <Menu.Item
                    className="cursor-pointer"
                    onClick={() => window.open(LINKS.WHITEPAPER, '_blank').focus()}
                    content="Whitepaper"
                />
                {/* <Menu.Item
                    className="cursor-pointer"
                    onClick={() => window.open(LINKS.COMMUNITY, '_blank').focus()}
                    content="Community"
                /> */}
            </Menu.Menu>

            {/* <div className="absolute right-4 top-24 field py-3">
                <div className="ui toggle checkbox">
                    <input
                        type="checkbox"
                        value="any"
                        onChange={toggle}
                        checked={isDark}
                    />
                    <label
                        className="coloring cursor-pointer"
                        onClick={toggle}
                    >{isDark ? '🌜' : '🌞'}</label>
                </div>
            </div> */}

        </Menu>
    )
}