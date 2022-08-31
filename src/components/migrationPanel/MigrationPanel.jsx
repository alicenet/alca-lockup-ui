import { useSelector } from "react-redux";
import { classNames } from "utils/generic";
import { Header, Segment, Input, Button, Icon } from "semantic-ui-react";

/**
 * @prop {array} quadrants - Should be array of objects containing {title, sub, value, valueName} 
 * @prop {string} preTextHeader - Text for first column header
 * @prop {string} postTextHeader - Text for second column header
 * @prop {bool} hideButton - Hide the button?
 * @prop {bool} buttonDisabled - Button disabled?
 * @prop {function} buttonOnClick - Button onClick event
 * @prop {bool} hideInput - Hide input?
 * @prop {bool} inputDisabled - Input disabled?
 * @prop {string} inputValue - Input value
 * @prop {function} inputOnChange - Input onChange
 * @prop {function} inputBtnOnClick - Input btn on click
 * @prop {function} inputSubText - Input sub text
 * @prop {bool} loading - is something loading
 * @prop {bool} disableLeft - Disable left styling on left column?
 * @returns 
 */
export function MigrationPanel({ quadrants, preTextHeader, postTextHeader, disableLeft, buttonDisabled, buttonOnClick, inputSubText, hideButton, hideInput, inputOnChange, inputValue, inputDisabled, inputBtnOnClick, loading }) {

    const MigrationStatus = () => {

        if (quadrants.length !== 4) {
            throw "MigrationStatus requires prop 'quadrants' to be an array of length 4 containing appropriate prop objects. See inline comments."
        }

        const StatusQuadrant = ({ title, sub, value, valueName, isTop }) => {
            return (
                <div className={classNames("py-3 w-[85%]", {
                    "border-b-[1px]": isTop
                })}>
                    <div className="text-xs font-bold text-gray-500">{title}</div>
                    <div className="flex items-end mt-2">
                        <div className="flex items-end text-lg">{value}</div>
                        <div className="flex items-end ml-1 relative -top-[2px] font-bold">{valueName.toUpperCase()}</div>
                    </div>
                </div>
            )
        }
        const parsedQuadrants = (() => {
            const quadSet = new Array(4);
            for (let i = 0; i < quadrants.length; i++) {
                quadSet[i] = !!quadrants[i] ? <StatusQuadrant {...quadrants[i]} isTop={i === 0 || i === 2} /> : (<div></div>)
            }
            return [
                [quadSet[0], quadSet[1]],
                [quadSet[2], quadSet[3]],
            ]
        })()

        const getCols = () => {
            let cols = [];
            for (let i = 0; i < parsedQuadrants.length; i++) {
                cols.push(
                    <div className={classNames("flex flex-col w-full justify-start items-start border-gray-300 px-9 py-4", {
                        "border-r-[1px]": i === 0,
                        // "pl-8": i !== 0,
                        "border-t-2": disableLeft,
                        "bg-gray-100": i===0 && disableLeft,
                        "text-gray-300": i===0 && disableLeft,
                        "border-t-blue-200": i===1,
                        "rounded-tr-lg": i===1 && disableLeft,
                        "rounded-tl-lg": i===0 && disableLeft,
                    })}>
                        <Header as="h5" className={classNames({"text-gray-400": disableLeft && i===0})}>{i === 0 ? preTextHeader : postTextHeader}</Header>
                        {parsedQuadrants[i]}
                    </div>
                )
            }
            return cols;
        }

        return (
            <div className="relative justify-center items-center flex flex-row ">
                {getCols()}
                <div className="centerabsarrow z-20 drop-shadow-sm  p-3 flex justify-center items-center bg-white">
                    <Icon name='arrow circle right' className="bg-red-100" className="relative bottom-[1px] left-[1px] text-[#235979]" />
                </div>
            </div>
        )

    }

    return (
        <Segment color={!disableLeft ? "blue" : ""} className={"p-0 w-[500px] border-t-0"}>

            {!hideInput && (
                <div className="text-left p-6 bg-gray-50 border border-b-stone-200">
                    <Header sub className="mb-2">Enter amount of MadTokens to migrate</Header>
                    <Input fluid
                        disabled={inputDisabled}
                        placeholder="0"
                        value={inputValue}
                        onChange={inputOnChange}
                        action={{
                            content: "Max",
                            secondary: true,
                            size: "mini",
                            onClick: inputBtnOnClick,
                            disabled: inputDisabled
                        }}
                    />
                    {inputSubText && (
                        <div className="text-xs relative top-1 left-1 text-gray-700">
                            {inputSubText}
                        </div>
                    )}
                </div>
            )}

            <div>
                <MigrationStatus />
            </div>

            {!hideButton && (
                <div>
                    <Button primary size="small" fluid
                        className="relative rounded-t-none"
                        disabled={buttonDisabled}
                        onClick={buttonOnClick}
                        loading={loading}
                        content="Start Migration"
                    />
                </div>
            )}

        </Segment>
    );

}