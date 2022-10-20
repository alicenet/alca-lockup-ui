import React from "react";
import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "components";
import { LINKS } from "utils/constants";

export function Header() {

    const location = useLocation();

    return (
        <Menu borderless className="top-0 left-0 bg-white w-full h-24 rounded-none sticky">
            <Menu.Item className="items-center">
                <Link to="/" className="m-6 w-20 flex justify-start items-start">
                    <Logo />
                </Link>
            </Menu.Item>

            <Menu.Item position="right" className="items-center" >

                <Menu.Item
                    className="cursor-pointer ml-4"
                    onClick={() => window.location.href = LINKS.MIGRATION}
                    content="ALCA Migration"
                />
                
                <Menu.Item as={Link} active={true} to="/">
                    ALCA Lockup
                </Menu.Item>

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