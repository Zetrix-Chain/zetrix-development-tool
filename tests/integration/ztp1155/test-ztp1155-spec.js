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

describe('Test contract ztp1155', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing contract info function', async () => {

        await TEST_QUERY("### 1.1 Getting contract info",
            contractHandler, {
                method: 'contractInfo'
            }, TEST_CONDITION.EQUALS, "MY 1155", 'name');
    });

    [1, 2, 3].forEach(value => {
        it('2.0 testing mint function', async () => {

            await TEST_INVOKE("### 2." + value + " Minting token " + value,
                contractHandler, txInitiator, {
                    method: 'mint',
                    params: {
                        to: sourceAddress,
                        id: value.toString(),
                        value: "1000000000000"
                    }
                }, TEST_RESULT.SUCCESS);
        })
    });

    it('3.0 testing get balance of function', async () => {

        await TEST_QUERY("### 3.1 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "1000000000000");
    });

    it('4.0 testing token uri function', async () => {

        await TEST_QUERY("### 4.1 Getting token uri",
            contractHandler, {
                method: 'uri',
                params: {
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "https://example.com/1");
    });

    it('5.0 testing get is approved for all function', async () => {

        await TEST_QUERY("### 5.1 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi"
                }
            }, TEST_CONDITION.EQUALS, false);
    });

    it('6.0 testing safe transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";
        let value = "500000000000";

        await TEST_INVOKE("### 6.1 Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient + " with value " + value,
            contractHandler, txInitiator, {
                method: 'safeTransferFrom',
                params: {
                    from: sourceAddress,
                    to: recipient,
                    id: tokenId,
                    value: value
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 6.2 Getting owner of token " + tokenId,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: recipient,
                    id: tokenId
                }
            }, TEST_CONDITION.EQUALS, value);
    });

    it('7.0 testing set approval for all from function', async () => {

        let operator = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";

        await TEST_INVOKE("### 7.1 Setting approval for all from " + sourceAddress + " to " + operator,
            contractHandler, txInitiator, {
                method: 'setApprovalForAll',
                params: {
                    operator: operator,
                    approved: true
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 7.2 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: operator
                }
            }, TEST_CONDITION.EQUALS, true);
    });

    it('8.0 testing burn function', async () => {

        await TEST_INVOKE("### 8.1 Burning token",
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    from: sourceAddress,
                    id: "1",
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 8.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress,
                    id: "1"
                }
            }, TEST_CONDITION.EQUALS, "500000000000");
    });

    it('9.0 testing mint batch function', async () => {

        await TEST_INVOKE("### 9.1 Minting batch token",
            contractHandler, txInitiator, {
                method: 'mintBatch',
                params: {
                    to: sourceAddress,
                    ids: ["4", "5", "6"],
                    values: ["1000000000000", "1000000000000", "1000000000000"]
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 9.2 Getting balance batch of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["4", "5", "6"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "1000000000000", "1000000000000"], "", TEST_RESP_TYPE.ARRAY);

    })

    it('10.0 testing burn batch function', async () => {

        await TEST_INVOKE("### 10.1 Minting batch token",
            contractHandler, txInitiator, {
                method: 'burnBatch',
                params: {
                    from: sourceAddress,
                    ids: ["5", "6"],
                    values: ["700000000000", "400000000000"]
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 10.2 Getting balance batch of " + sourceAddress,
            contractHandler, {
                method: 'balanceOfBatch',
                params: {
                    accounts: [sourceAddress, sourceAddress, sourceAddress],
                    ids: ["4", "5", "6"]
                }
            }, TEST_CONDITION.EQUALS, ["1000000000000", "300000000000", "600000000000"], "", TEST_RESP_TYPE.ARRAY);
    })

});
