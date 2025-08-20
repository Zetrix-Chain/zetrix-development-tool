const ZtxChainSDK = require('zetrix-sdk-nodejs');
const {TEST_RESULT, TEST_CONDITION, TEST_RESP_TYPE} = require("../../utils/constant");
const TEST_QUERY = require("../../utils/query-contract");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();

const contractHandler = {
    sdk: new ZtxChainSDK({
        host: process.env.NODE_URL,
        secure: true
    }),
    contractAddress: process.env.SPEC_BYTES,
};

describe('Test contract bytes', function () {
    this.timeout(30000);

    it('testing num2bin function', async () => {

        await TEST_QUERY("### num2bin function",
            contractHandler, {
                method: 'num2bin',
                params: {
                    num: 10,
                    length: "4"
                }
            }, TEST_CONDITION.EQUALS, "1010", "data");
    });

    it('testing num2bin function', async () => {

        await TEST_QUERY("### num2bin function",
            contractHandler, {
                method: 'num2bin',
                params: {
                    num: "10",
                    length: "4"
                }
            }, TEST_CONDITION.EQUALS, "0010", "data");
    });

    it('testing reverseBytes function', async () => {

        await TEST_QUERY("### reverseBytes function",
            contractHandler, {
                method: 'reverseBytes',
                params: {
                    binaryStr: "1110000001100100",
                    length: "8"
                }
            }, TEST_CONDITION.EQUALS, "0110010011100000", "data");
    });

    it('testing reverseBytes function', async () => {

        await TEST_QUERY("### reverseBytes function",
            contractHandler, {
                method: 'reverseBytes',
                params: {
                    binaryStr: "001110000001100100",
                    length: "6"
                }
            }, TEST_CONDITION.EQUALS, "01000000011000001110", "data");
    });

});
