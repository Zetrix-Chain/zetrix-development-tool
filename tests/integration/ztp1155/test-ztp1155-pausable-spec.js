const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const {TEST_RESULT} = require("../../../utils/constant");
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

describe('Test contract ztp1155 pausable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-pausable-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing mint function', async () => {

        await TEST_INVOKE("### 1.1 Minting token",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '1',
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);
    });

    it('2.0 testing pause function', async () => {

        await TEST_INVOKE("### 2.1 Pausing contract",
            contractHandler, txInitiator, {
                method: 'pause'
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 2.2 Trying to mint token after pausing",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '2',
                    value: "1000000000000"
                }
            }, TEST_RESULT.FAILED);
    });

    it('3.0 testing unpause function', async () => {

        await TEST_INVOKE("### 3.1 Unpausing contract",
            contractHandler, txInitiator, {
                method: 'unpause'
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 3.2 Trying to mint token after unpausing",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: '2',
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);
    });

});
