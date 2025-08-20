const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const {TEST_RESULT, TEST_CONDITION, TEST_RESP_TYPE} = require("../../../utils/constant");
const TEST_QUERY = require("../../../utils/query-contract");
const TEST_INVOKE = require("../../../utils/invoke-contract");
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

describe('Test contract ztp1155 uri storage', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-uri-storage-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing set token uri and base uri function', async () => {

        await TEST_QUERY("### 1.1 Getting token uri",
            contractHandler, {
                method: 'uri',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "https://example.com/1");

        await TEST_INVOKE("### 1.2 Set token uri",
            contractHandler, txInitiator, {
                method: 'setURI',
                params: {
                    id: '1',
                    tokenURI: "token1555/token1.json"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 1.3 Set base uri",
            contractHandler, txInitiator, {
                method: 'setBaseURI',
                params: {
                    baseURI: 'https://zetrix.io/'
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.4 Getting token uri after setting base uri and token uri",
            contractHandler, {
                method: 'uri',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "https://zetrix.io/token1555/token1.json");

    });
});
