import 'library/math'

const LogicOp = function () {

    const MathLib = new Math();

    const self = this;

    /**
     * Represents the leftShift functionality.
     *
     * The `leftShift` function typically performs a bitwise left shift operation
     * on a given number. In a left shift operation, the binary representation of a
     * number is shifted to the left by the specified number of bits, effectively
     * multiplying the number by a power of two. For each shift to the left, the
     * number is doubled, and the leftmost bits are discarded if they exceed the
     * number's bit-width, while zeros are shifted in on the right.
     *
     * @param {number|string} value - The numeric value to be shifted.
     * @param {number|string} shiftBy - The number of positions to shift the bits to the left.
     * @returns {number|string} The result of shifting the bits of the given value to the left by the specified number of positions.
     */
    self.leftShift = function (value, shiftBy) {
        return Utils.int256Mul(value, MathLib.pow(2, shiftBy));
    };

    /**
     * Performs a right bitwise shift operation on the given value.
     *
     * The rightShift operation shifts the bits of the provided value
     * to the right by a specified number of positions. In a right
     * shift operation, the sign bit is used to fill the vacated bit
     * positions to the left for signed numbers, which is also known
     * as arithmetic shift. For unsigned numbers, zeroes are used
     * to fill these positions.
     *
     * Note: This operation is equivalent to the `>>` operator
     * for signed numbers and the `>>>` operator for unsigned numbers
     * in JavaScript.
     *
     * @param {number|string} value - The numeric value to be shifted.
     * @param {number|string} shiftBy - The number of positions to shift the bits to the right.
     * @returns {number|string} The result of shifting the bits of the given value to the right by the specified number of positions.
     */
    self.rightShift = function (value, shiftBy) {
        return Utils.int256Div(value, MathLib.pow(2, shiftBy));
    };

    /**
     * Represents a function for performing a bitwise AND operation.
     *
     * The `bitwiseAnd` function takes two integer inputs and returns a new integer
     * that is the result of a bitwise AND operation applied to them. In a bitwise
     * AND operation, each bit of the output is `1` if the corresponding bit of
     * each operand is `1`, otherwise it is `0`.
     *
     * @function
     * @param {number|string} a - The first operand for the bitwise AND operation. Must be an integer.
     * @param {number|string} b - The second operand for the bitwise AND operation. Must be an integer.
     * @returns {number|string} The result of the bitwise AND operation.
     */
    self.bitwiseAnd = function (a, b) {
        let result = 0;
        let multiplier = 1;

        while (Utils.int256Compare(a, 0) > 0 && Utils.int256Compare(b, 0) > 0) {
            if (Utils.int256Compare(Utils.int256Mod(a, 2), 1) === 0 && Utils.int256Compare(Utils.int256Mod(b, 2), 1) === 0) {
                result = Utils.int256Add(result, multiplier);
            }

            a = Utils.int256Div(a, 2);
            b = Utils.int256Div(b, 2);
            multiplier = Utils.int256Mul(multiplier, 2);
        }

        return result;
    };

    /**
     * Performs a bitwise OR operation on two integers.
     *
     * This method takes two integer arguments and returns an integer result
     * where each bit in the result is the logical OR of the corresponding bits
     * of the input values. The bitwise OR operation sets a bit if it is set
     * in either one of the operands.
     *
     * @param {number|string} a - The first integer operand.
     * @param {number|string} b - The second integer operand.
     * @returns {number|string} The result of the bitwise OR operation.
     */
    self.bitwiseOr = function (a, b) {
        let result = 0;
        let multiplier = 1;

        while (Utils.int256Compare(a, 0) > 0 || Utils.int256Compare(b, 0) > 0) {
            if (Utils.int256Compare(Utils.int256Mod(a, 2), 1) === 0 || Utils.int256Compare(Utils.int256Mod(b, 2), 1) === 0) {
                result = Utils.int256Add(result, multiplier);
            }

            a = Utils.int256Div(a, 2);
            b = Utils.int256Div(b, 2);
            multiplier = Utils.int256Mul(multiplier, 2);
        }

        return result;
    };
};