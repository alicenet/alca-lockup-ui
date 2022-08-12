/**
 * Conditionally joins classNames together
 * @param classNames - an object per class name
 */
export const classNames = (...classNames) => {
    let classes = [];

    classNames.forEach(className => {
        if (!className) {
            return;
        }

        const classNameType = typeof className;
        if (classNameType === 'string') {
            classes.push(className);
        } else if (classNameType === 'object') {
            for (const key in className) {
                if (className[key]) {
                    classes.push(key)
                }
            }
        }
    })

    return classes.join(' ');
}

/**
 * Async promise waiter, used for artificial waiting
 * @param msLength - How long to wait in ms
 * @param callerId - Supply to assist in debugging, if you so desire
 */
export const waitFor = (msLength, callerId) => {

    const quickID = (() => {
        let id = '';
        let nums = '0123456789';
        while (id.length < 8) {
            id += nums.charAt(Math.floor(Math.random() * nums.length));
        }
        return id;
    });

    let timeoutID = quickID();
    console.debug(`Waiting for ${msLength}ms via util.generic.waitFor(${msLength}) with ID: ${timeoutID}` + (callerId ? ` Caller: ${callerId}` : ""));
    return new Promise(res => {
        setTimeout(() => {
            res();
            console.debug(`${timeoutID} has been resolved.`)
        }, msLength)
    });
}