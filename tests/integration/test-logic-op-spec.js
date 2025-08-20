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
    contractAddress: process.env.SPEC_LOGIC_OP,
};

describe('Test contract logic operation', function () {
    this.timeout(30000);

    it('testing bitwiseAnd function', async () => {

        await TEST_QUERY("### bitwiseAnd function",
            contractHandler, {
                method: 'bitwiseAnd',
                params: {
                    a: "24", // 11000
                    b: "20"  // 10100
                }
            }, TEST_CONDITION.EQUALS, "16", "data"); // 10000
    });

    it('testing bitwiseOr function', async () => {

        await TEST_QUERY("### bitwiseOr function",
            contractHandler, {
                method: 'bitwiseOr',
                params: {
                    a: "24", // 11000
                    b: "20"  // 10100
                }
            }, TEST_CONDITION.EQUALS, "28", "data"); // 11100
    });

    it('testing leftShift function', async () => {

        await TEST_QUERY("### leftShift function",
            contractHandler, {
                method: 'leftShift',
                params: {
                    value: "24", // 00011000
                    shiftBy: "2"
                }
            }, TEST_CONDITION.EQUALS, "96", "data"); // 01100000
    });

    it('testing rightShift function', async () => {

        await TEST_QUERY("### rightShift function",
            contractHandler, {
                method: 'rightShift',
                params: {
                    value: "24", // 00011000
                    shiftBy: "2"
                }
            }, TEST_CONDITION.EQUALS, "6", "data"); // 00000110
    });

});
