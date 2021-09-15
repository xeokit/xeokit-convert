function isString(value) {
    return (typeof value === 'string' || value instanceof String);
}

/**
 * @private
 */
const utils = {
    isString: isString,
};

export {utils};
