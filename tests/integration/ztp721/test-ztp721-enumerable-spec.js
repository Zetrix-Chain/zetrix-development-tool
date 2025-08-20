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

describe('Test contract ztp72 enumerable', function () {
    this.timeout(30000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-enumerable-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    [1, 2, 3].forEach(value => {
        it('1.0 testing mint function', async () => {

            await TEST_INVOKE("### 1." + value + " Minting token " + value,
                contractHandler, txInitiator, {
                    method: 'mint',
                    params: {
                        to: sourceAddress
                    }
                }, TEST_RESULT.SUCCESS);
        })
    });

    it('2.0 testing token of owner by index function', async () => {

        await TEST_QUERY("### 2.1 Get token of owner by index",
            contractHandler, {
                method: 'tokenOfOwnerByIndex',
                params: {
                    index: 2,
                    owner: sourceAddress
                }
            }, TEST_CONDITION.GREATER_THAN_OR_EQUAL, 1, "", "NUMBER");
    });

    it('3.0 testing total supply function', async () => {

        await TEST_QUERY("### 3.1 Get total supply",
            contractHandler, {
                method: 'totalSupply'
            }, TEST_CONDITION.GREATER_THAN_OR_EQUAL, 3, "", "NUMBER");
    });

    it('4.0 testing token by index function', async () => {

        await TEST_QUERY("### 4.1 Get token by index",
            contractHandler, {
                method: 'tokenByIndex',
                params: {
                    index: 2
                }
            }, TEST_CONDITION.GREATER_THAN_OR_EQUAL, 1, "", "NUMBER");
    });

});
