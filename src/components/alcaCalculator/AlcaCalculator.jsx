import { Input, Icon, Header } from "semantic-ui-react";
import React from "react";
import ethAdapter from "eth/ethAdapter";
import { ethers } from "ethers";

export function AlcaCalculator() {

    const [input, setInput] = React.useState();
    const [excAmount, setExcAmount] = React.useState();

    function updateExchangeAmount(e) {

        const updateExcAmount = async (amt) => {
            let exchAmount = await ethAdapter.getMadTokenToALCAExchangeRate(ethers.utils.parseEther(amt))
            setExcAmount(Number(exchAmount).toLocaleString(false, {maximumFractionDigits: 4}) + " ALCA");
        }

        let amt = e.target.value;
        if (amt === "." || amt === "") {
            updateExcAmount("0");
            return setInput("");
        }
        if (!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(amt)) {
            updateExcAmount("0");
            return;
        }
        let split = amt.split(".");
        if (split[0].length >= 10 || (split[1] && split[1].length > 18)) {
            return
        }
        setInput(e.target.value);
        updateExcAmount(amt)
    }

    return (
        <div>

            <div>
                <Header>
                    How many ALCA will I receive?
                    <Header.Subheader>Use the calculater below to see how many tokens you could receive</Header.Subheader>
                    </Header>
            </div>

            <div className="mt-4">
                <Input placeholder={"MAD To Migrate"} size="small" value={input} className="calcInput" onChange={updateExchangeAmount} />
                <Icon name="arrow circle right" className="mx-4" />
                <Input disabled placeholder={"ALCA Received"} value={excAmount} size="small" className="calcInput"/>
            </div>

        </div>
    );

}

