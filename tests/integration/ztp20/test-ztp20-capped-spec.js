const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const TEST_INVOKE = require("../../../utils/invoke-contract");
const TEST_QUERY = require("../../../utils/query-contract");
const {TEST_RESULT, TEST_CONDITION} = require("../../../utils/constant");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();

const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;

const privateKey1 = "privBrr7fmQiMJXCtW7GXb4qoU393w12TBqm5WUvid2h5LgULpTRo5rX";
const sourceAddress1 = "ZTX3M6pWnCXk4e6vrXu4SQQganjQJrrF8Xezx";

const contractHandler = {
    sdk: new ZtxChainSDK({
        host: process.env.NODE_URL,
        secure: true
    }),
    contractAddress: "",
};

const txInitiator = {
    privateKey: privateKey,
    sourceAddress: sourceAddress,
};

const txInitiator1 = {
    privateKey: privateKey1,
    sourceAddress: sourceAddress1,
};

describe('Test contract ztp20 capped', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-capped-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing mint lesser than cap', async () => {

        await TEST_INVOKE("### 1.1 Minting token",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    account: sourceAddress,
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");
    });

    it('2.0 testing mint more than cap', async () => {

        await TEST_INVOKE("### 2.1 Minting token",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    account: sourceAddress,
                    value: "1010000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 2.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");
    });
});
