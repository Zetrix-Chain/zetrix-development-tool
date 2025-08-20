const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const {TEST_RESULT, TEST_CONDITION, TEST_RESP_TYPE} = require("../../../utils/constant");
const TEST_INVOKE = require("../../../utils/invoke-contract");
const TEST_QUERY = require("../../../utils/query-contract");
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
describe('Test contract ztp1155 supply', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-supply-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing total supply function', async () => {

        await TEST_INVOKE("### 1.1 Minting token 1 value 1000000000000",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '1',
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 1.2 Minting token 1 value 200000000000",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '1',
                    value: "200000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 1.3 Minting token 2 value 500000000000",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '2',
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.4 Getting total supply token 1",
            contractHandler, {
                method: 'totalSupply',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "1200000000000");

        await TEST_QUERY("### 1.5 Getting total supply token 2",
            contractHandler, {
                method: 'totalSupply',
                params: {
                    id: "2"
                }
            }, TEST_CONDITION.EQUALS, "500000000000");

        await TEST_QUERY("### 1.6 Getting total supply token all",
            contractHandler, {
                method: 'totalSupply'
            }, TEST_CONDITION.EQUALS, "1700000000000");

        await TEST_QUERY("### 1.7 Check if token 1 exist",
            contractHandler, {
                method: 'exist',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, true);

        await TEST_INVOKE("### 1.8 Burn token 1 value 400000000000",
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    from: sourceAddress,
                    id: '1',
                    value: "400000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.9 Getting total supply token 1 after burn",
            contractHandler, {
                method: 'totalSupply',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "800000000000");

        await TEST_QUERY("### 1.9 Getting total supply token all after burn",
            contractHandler, {
                method: 'totalSupply'
            }, TEST_CONDITION.EQUALS, "1300000000000");

    });
});
