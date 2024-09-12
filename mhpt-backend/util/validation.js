const hasKeys = (obj, arr) => {
    const missingkeys = arr.filter(
        (prop) => !Object.prototype.hasOwnProperty.call(obj, prop)
    );
    if (missingkeys.length) return false;
    // throw { error: "MISSING_REQUIRED_FIELDS", code: 400 };
    return true;
};

const cherryPickKeys = (obj, arr) => {
    const _obj = {};
    arr.map((key) => {
        _obj[key] = obj[key]
    })
    return _obj;
};

const validToken = (token) => {
 return token && /^[a-z0-9]*$/.test(token);
}

module.exports = {
    hasKeys,
    cherryPickKeys,
    validToken
};
