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