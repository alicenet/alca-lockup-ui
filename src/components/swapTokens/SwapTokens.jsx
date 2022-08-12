import { Header, Container, Input, Button } from "semantic-ui-react";
import { useSelector } from "react-redux";

export function SwapTokens() {

    const { web3Connected } = useSelector(state => ({
        web3Connected: state.application.web3Connected
    }));

    return (
        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                After granting allowance to the contract you can proceed with swapping your mad tokens for ALCA tokens
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2">Amount of MadTokens to swap</Header>
                <Input
                    className=""
                    disabled={!web3Connected}
                    placeholder="0"
                    action={{
                        content: "Max",
                        secondary: true,
                        size: "mini"
                    }}
                />
            </div>

            <div>
                <Button
                    size="small"
                    content='Submit'
                    className="relative left-[2px] mt-4 w-[318px]"
                    disabled={!web3Connected}
                />
            </div>

        </Container>
    );
}
