function Struct(keys) {
    if (keys.length === 0) return null;
    const count = keys.length;

    /** @constructor */
    function constructor() {
        for (let i = 0; i < count; i++) this[keys[i]] = arguments[i];
    }

    return constructor;
}
