const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const TEST_INVOKE = require("../../../utils/invoke-contract");
const {TEST_RESULT} = require("../../../utils/constant");
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

describe('Test contract ztp72 burnable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-burnable-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing mint and burn function by same owner', async () => {

        let tokenId = "1";

        await TEST_INVOKE("### 1.1 Minting token " + tokenId,
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 1.2 Burning token " + tokenId,
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    tokenId: tokenId
                }
            }, TEST_RESULT.SUCCESS);
    });

    it('2.0 testing mint and burn function by different owner', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";

        await TEST_INVOKE("### 2.1 Minting token " + tokenId + " to " + sourceAddress,
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 2.2 Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient,
            contractHandler, txInitiator, {
                method: 'transferFrom',
                params: {
                    from: sourceAddress,
                    to: recipient,
                    tokenId: tokenId
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_INVOKE("### 2.3 Burning token " + tokenId,
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    tokenId: tokenId
                }
            }, TEST_RESULT.FAILED);
    });

});
