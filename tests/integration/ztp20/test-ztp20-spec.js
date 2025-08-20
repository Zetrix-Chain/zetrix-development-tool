const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
const TEST_QUERY = require("../../../utils/query-contract");
const TEST_INVOKE = require("../../../utils/invoke-contract");
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

describe('Test contract ztp20', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing contract info function', async () => {

        await TEST_QUERY("### 1.1 Getting contract info",
            contractHandler, {
                method: 'contractInfo'
            }, TEST_CONDITION.EQUALS, "MY TOKEN", 'name');
    });

    [1, 2, 3].forEach(value => {

        it('2.0 testing mint function', async () => {
            await TEST_INVOKE("### 2." + value + " Minting token count " + value,
                contractHandler, txInitiator, {
                    method: 'mint',
                    params: {
                        account: sourceAddress,
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
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "3000000000000");
    });

    it('4.0 testing transfer function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let value = "500000000000";

        await TEST_INVOKE("### 4.1 Transferring token from " + sourceAddress + " to " + recipient + " with value " + value,
            contractHandler, txInitiator, {
                method: 'transfer',
                params: {
                    to: recipient,
                    value: value
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 4.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "2500000000000");
    });

    it('5.0 testing approve and allowance function', async () => {

        let spender = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";

        await TEST_INVOKE("### 5.1 Setting approval from " + sourceAddress + " to " + spender,
            contractHandler, txInitiator, {
                method: 'approve',
                params: {
                    spender: spender,
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 5.2 Getting allowance from " + sourceAddress + " to " + spender,
            contractHandler, {
                method: 'allowance',
                params: {
                    owner: sourceAddress,
                    spender: spender
                }
            }, TEST_CONDITION.EQUALS, "500000000000");
    });

    it('6.0 testing transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let value = "500000000000";

        await TEST_INVOKE("### 6.1 Transferring token from " + sourceAddress + " to " + recipient + " with value " + value,
            contractHandler, txInitiator, {
                method: 'transferFrom',
                params: {
                    from: sourceAddress,
                    to: recipient,
                    value: value
                }
            }, TEST_RESULT.FAILED); // Must be error because we don't use the recipient private key to invoke tx

        await TEST_QUERY("### 6.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: recipient
                }
            }, TEST_CONDITION.EQUALS, "500000000000"); // Recipient balance remain as before
    });

    it('7.0 testing burn function', async () => {

        await TEST_INVOKE("### 7.1 Burning token",
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    account: sourceAddress,
                    value: "500000000000"
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 7.2 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "2000000000000");
    });

});
