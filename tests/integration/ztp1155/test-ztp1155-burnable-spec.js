const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const TEST_INVOKE = require("../../../utils/invoke-contract");
const TEST_QUERY = require("../../../utils/query-contract");
const {TEST_RESULT, TEST_CONDITION, TEST_RESP_TYPE} = require("../../../utils/constant");
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

describe('Test contract ztp1155 burnable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-burnable-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing mint and burn function by same owner', async () => {

        const tokenId = "1";

        await TEST_INVOKE("### 1.1 Minting token " + tokenId,
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: tokenId,
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");

        await TEST_INVOKE("### 1.3 Burning token",
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    from: sourceAddress,
                    id: tokenId,
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.4 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "500000000000");
    });

    it('2.0 testing mint and burn function by non-approved owner', async () => {

        const tokenId = "2";

        await TEST_INVOKE("### 2.1 Minting token " + tokenId,
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: tokenId,
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 2.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");

        await TEST_INVOKE("### 2.3 Burning token",
            contractHandler, txInitiator1, {
                method: 'burn',
                params: {
                    from: sourceAddress,
                    id: tokenId,
                    value: "500000000000"
                }
            }, TEST_RESULT.FAILED);

        await TEST_QUERY("### 2.4 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");

    });

    it('3.0 testing mint and burn function by approved owner', async () => {

        const tokenId = "3";

        await TEST_INVOKE("### 3.1 Minting token " + tokenId,
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: tokenId,
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 3.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");

        await TEST_INVOKE("### 3.3 Setting approval for all from " + sourceAddress + " to " + sourceAddress1,
            contractHandler, txInitiator, {
                method: 'setApprovalForAll',
                params: {
                    operator: sourceAddress1,
                    approved: true
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 3.4 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: sourceAddress1
                }
            }, TEST_CONDITION.EQUALS, true);

        await TEST_INVOKE("### 3.5 Burning token by " + sourceAddress1,
            contractHandler, txInitiator1, {
                method: 'burn',
                params: {
                    from: sourceAddress,
                    id: tokenId,
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 3.6 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, "500000000000");
    });

    it('4.0 testing batch mint and batch burn function by non approved owner', async () => {

        await TEST_INVOKE("### 4.1 Minting token by " + sourceAddress,
            contractHandler, txInitiator, {
                method: 'mintBatch',
                params: {
                    to: sourceAddress,
                    ids: ["4", "5", "6"],
                    values: ["1000000000000", "1000000000000", "1000000000000"]
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 4.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["4", "5", "6"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "1000000000000", "1000000000000"], "", TEST_RESP_TYPE.ARRAY);

        await TEST_INVOKE("### 4.3 Setting approval for all from " + sourceAddress + " to " + sourceAddress1,
            contractHandler, txInitiator, {
                method: 'setApprovalForAll',
                params: {
                    operator: sourceAddress1,
                    approved: false
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 4.4 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: sourceAddress1
                }
            }, TEST_CONDITION.EQUALS, false);

        await TEST_INVOKE("### 4.5 Burning token by " + sourceAddress1,
            contractHandler, txInitiator1, {
                method: 'burnBatch',
                params: {
                    from: sourceAddress,
                    ids: ["5", "6"],
                    values: ["700000000000", "400000000000"]
                }
            }, TEST_RESULT.FAILED);

        await TEST_QUERY("### 4.6 Getting balance batch of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["4", "5", "6"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "1000000000000", "1000000000000"], "", TEST_RESP_TYPE.ARRAY);
    });

    it('5.0 testing batch mint and batch burn function by approved owner', async () => {

        await TEST_INVOKE("### 5.1 Minting token by " + sourceAddress,
            contractHandler, txInitiator, {
                method: 'mintBatch',
                params: {
                    to: sourceAddress,
                    ids: ["7", "8", "9"],
                    values: ["1000000000000", "1000000000000", "1000000000000"]
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 5.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["7", "8", "9"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "1000000000000", "1000000000000"], "", TEST_RESP_TYPE.ARRAY);

        await TEST_INVOKE("### 5.3 Setting approval for all from " + sourceAddress + " to " + sourceAddress1,
            contractHandler, txInitiator, {
                method: 'setApprovalForAll',
                params: {
                    operator: sourceAddress1,
                    approved: true
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 5.4 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: sourceAddress1
                }
            }, TEST_CONDITION.EQUALS, true);

        await TEST_INVOKE("### 5.5 Burning token by " + sourceAddress1,
            contractHandler, txInitiator1, {
                method: 'burnBatch',
                params: {
                    from: sourceAddress,
                    ids: ["8", "9"],
                    values: ["700000000000", "400000000000"]
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 5.6 Getting balance batch of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["7", "8", "9"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "300000000000", "600000000000"], "", TEST_RESP_TYPE.ARRAY);
    });

});
