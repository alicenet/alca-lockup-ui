/**
 * 
 * @param {Object} obj - Object to parse 
 * @param {String} keyname - Keyname to search for
 * @returns 
 */
module.exports._recurseForObjectKey = function(obj, keyname) {
    let foundKeyVals = {};
    const recurse = (obj) => {
        for (let key of Object.keys(obj)) {
            // Found ABI
            if (key === keyname) {
                foundKeyVals = obj[key];
            }
            // If not ABI, try and recurse
            if (typeof obj[key] === "object") {
                recurse(obj[key]);
            } else {
                continue;
            }
        }
    }
    recurse(obj)
    return foundKeyVals;
}