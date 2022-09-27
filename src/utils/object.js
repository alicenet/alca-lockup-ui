/**
 * Invert the Keys/Values of a given JS object
 * @param { Object } obj - The object of which to invert keys and values
 * @returns { Object } - The object with it's keys/values inverted
 */
export const invertObjectKeyValues = (obj) => {
    let invertedObj = {};
    for (let o of Object.keys(obj)) {
        invertedObj[obj[o]] = o;
    }
    return invertedObj;
}

/**
 * Gets the lowest index share value of a given Token Metadata array of object
 * @param { Array<Object> } metadataArray - Token metadata array of objects
 * @returns { Object }  
 */
export const getMinTokenValue = (metadataArray) => {
    return metadataArray && metadataArray.length > 0
        ? metadataArray[0]
        : {};
}

/**
 * Find a attribute in the Token Metadata attributes object
 * @param { Object } attributes - Attribute Name
 * @param { String } attributeName - Attribute Name
 * @returns { Object }  
 */
export const findTokenAttributeByName = (attributes, attributeName) => {
    return attributes && attributes.length && attributes.find(item => item.trait_type === attributeName);
}