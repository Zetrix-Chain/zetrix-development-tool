function implementsInterface(obj, interfaceObj) {
    let keys = Object.keys(interfaceObj);
    let i;
    for (i = 0; i < keys.length; i += 1) {
        if (!obj.hasOwnProperty(keys[i]) ||
            typeof obj[keys[i]] !== "function") {
            return false;
        }
    }
    return true;
}
