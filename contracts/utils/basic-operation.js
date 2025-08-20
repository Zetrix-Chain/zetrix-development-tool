const BasicOperation = function () {

    this.loadObj = function (key) {
        let data = Chain.load(key);
        if (data !== false) {
            return JSON.parse(data);
        }

        return false;
    };

    this.saveObj = function (key, value) {
        let str = JSON.stringify(value);
        Chain.store(key, str);
    };

    this.delObj = function (key) {
        Chain.del(key);
    };

    this.getKey = function (k1, k2, k3 = '', k4 = '') {
        return (k4 === '') ? (k3 === '') ? (k1 + '_' + k2) : (k1 + '_' + k2 + '_' + k3) : (k1 + '_' + k2 + '_' + k3 + '_' + k4);
    };
};
