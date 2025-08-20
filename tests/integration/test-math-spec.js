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
    contractAddress: process.env.SPEC_MATH,
};

describe('Test contract math', function () {
    this.timeout(30000);

    it('testing pow function', async () => {

        await TEST_QUERY("### pow function",
            contractHandler, {
                method: 'pow',
                params: {
                    base: "10",
                    exp: "2"
                }
            }, TEST_CONDITION.EQUALS, "100", "data");
    });

    it('testing sqrt function', async () => {

        await TEST_QUERY("### sqrt function",
            contractHandler, {
                method: 'sqrt',
                params: {
                    x: "144"
                }
            }, TEST_CONDITION.EQUALS, "12", "data");
    });

    it('testing min function', async () => {

        await TEST_QUERY("### min function",
            contractHandler, {
                method: 'min',
                params: {
                    x: "144",
                    y: "122"
                }
            }, TEST_CONDITION.EQUALS, "122", "data");
    });

    it('testing max function', async () => {

        await TEST_QUERY("### max function",
            contractHandler, {
                method: 'max',
                params: {
                    x: "144",
                    y: "122"
                }
            }, TEST_CONDITION.EQUALS, "144", "data");
    });

});
