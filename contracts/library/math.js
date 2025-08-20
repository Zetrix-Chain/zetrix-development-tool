const Math = function () {

    const self = this;
    
    /**
     * Represents a power function.
     *
     * The `pow` property is typically used to perform exponentiation
     * calculations, where a base number is raised to the power of an exponent.
     *
     * @param {number|string} base - The base number.
     * @param {number|string} exp - Power of number.
     * @returns {number|string} - The power of number.
     */
    self.pow = function (base, exp) {
        let result = 1;
        let i;
        for (i = 0; i < exp; i += 1) {
            result = Utils.int256Mul(result, base);
        }
        return result;
    };

    /**
     * Calculates the square root of a given number.
     *
     * @param {number|string} x - The number to calculate the square root for.
     * @returns {number|string} The square root of the given number.
     * @throws {TypeError} Throws if the input is not a number.
     * @throws {RangeError} Throws if the input is a negative number.
     */
    self.sqrt = function (x) {
        let z = 0;
        if (Utils.int64Compare(x, 3) > 0) {
            z = x;
            let y = Utils.int64Add(Utils.int64Div(x, 2), 1);
            while (Utils.int64Compare(y, z) < 0) {
                z = y;
                y = Utils.int64Div(Utils.int64Add(Utils.int64Div(x, y), y), 2);
            }
        } else if (Utils.int64Compare(x, 0) !== 0) {
            z = "1";
        }
        return z;
    };

    /**
     * Represents the minimum value for a specific operation or range.
     * Typically used in comparisons, validations, or calculations
     * that require a lower boundary constraint.
     *
     * @param {number|string} x - number to compare
     * @param {number|string} y - number to compare
     * @returns {number|string} - the minimum value
     */
    self.min = function (x, y) {
        return Utils.int64Compare(x, y) < 0 ? x : y;
    };

    /**
     * Represents the maximum value for a specific operation or range.
     * Typically used in comparisons, validations, or calculations
     * that require a lower boundary constraint.
     *
     * @param {number|string} x - number to compare
     * @param {number|string} y - number to compare
     * @returns {number|string} - the maximum value
     */
    self.max = function (x, y) {
        return Utils.int64Compare(x, y) > 0 ? x : y;
    };


};