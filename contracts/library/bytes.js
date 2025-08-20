const Bytes = function () {

    const self = this;
    
    /**
     * Converts a number to a binary string of specified length.
     * Pads the binary string with leading zeros if necessary.
     *
     * @param {number|string} num - The number to convert to binary.
     * @param {number|string} length - The desired length of the binary string.
     * @returns {string} - The binary representation of the number.
     */
    self.num2bin = function (num, length) {
        let binary = num.toString(2); // Convert number to binary string
        // Pad with leading zeros to match the specified length
        return binary.padStart(length, '0').toString();
    };

    /**
     * Reverses the bytes in a binary string.
     *
     * @param {string} binaryStr - The binary string to have its bytes reversed.
     * @param {number|string} length - The bit length which determines how to divide the string into bytes.
     * @returns {string} - The binary string with its bytes reversed.
     */
    self.reverseBytes = function (binaryStr, length) {
        const paddingLength = Utils.int256Mod(Utils.int256Sub(8, Utils.int256Mod(length, 8)), 8);
        const paddedBinaryStr = binaryStr.padStart(Utils.int256Add(binaryStr.length, paddingLength), '0');

        let reversedStr = '';
        let i;
        for (i = 0; i < paddedBinaryStr.length; i += 8) {
            reversedStr = paddedBinaryStr.slice(i, i + 8) + reversedStr;
        }

        return reversedStr;
    };

};