function isString(value) {
    return (typeof value === 'string' || value instanceof String);
}

function apply(o, o2) {
    for (const name in o) {
        if (o.hasOwnProperty(name)) {
            o2[name] = o[name];
        }
    }
    return o2;
}

/**
 * @private
 */
const utils = {
    isString,
    apply
};

export {utils};
