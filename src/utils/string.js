import copy from "copy-to-clipboard";

/**
 * Splits a string with an ellipses, leaving designated length on both sides
 * @param {string} str - String to split
 * @param {int} lengthOnSides - How many characters to leave on sides of the ellipses
 */
export function splitStringWithEllipsis(str, lengthOnSides = 3) {
    if (typeof str !== "string") {
        return "";
    }
    return str.slice(0, 2 + lengthOnSides)
        + "..."
        + str.slice(str.length - lengthOnSides, str.length);
}

export const copyText = (text) => {
  copy(text, { format: 'text/plain' });
}
/**
 * Parse Token Metadata 
 * @param { String } metadata 
 * @returns { Object }
 */
export const parseTokenMetaData = (metadata) => {
    const [, encodedMetaData] = metadata.split("data:application/json;utf8,");
    return encodedMetaData ? JSON.parse(encodedMetaData) : {} ;
}