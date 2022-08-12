import { Header, Container, Input, Button } from "semantic-ui-react";
import { useSelector } from "react-redux";

export function AllowTokens() {

    const { web3Connected } = useSelector(state => ({
        web3Connected: state.application.web3Connected
    }));

    return (
        <Container className="flex flex-col justify-around items-center p-4 min-h-[240px]">

            <div className="text-sm text-center">
                Prior to swapping an allowance of tokens to spend must be granted to the ALCA contract <br />
            </div>

            <div className="text-left mt-8">
                <Header sub className="mb-2">Address to allow MadTokens from</Header>
                <Input
                    className=""
                    disabled={!web3Connected}
                    placeholder="0x0"
                    action={{
                        content: "All",
                        secondary: true
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
