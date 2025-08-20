const ZtxChainSDK = require('zetrix-sdk-nodejs');
const deployOperation = require("../../../scripts/deploy-operation");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();
const crypto = require('crypto');
const signData = require("../../../utils/sign-data");
const TEST_INVOKE = require("../../../utils/invoke-contract");
const TEST_QUERY = require("../../../utils/query-contract");
const {TEST_RESULT, TEST_CONDITION, TEST_RESP_TYPE} = require("../../../utils/constant");

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

function generateHash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

describe('Test contract ztp20 permit', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-permit-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing mint, approve by permit and check allowance', async () => {

        await TEST_INVOKE("### 1.1 Minting token",
            contractHandler, txInitiator, {
                method: 'mint',
                params: {
                    account: sourceAddress,
                    value: "1000000000000"
                }
            }, TEST_RESULT.SUCCESS);


        let nonce = await TEST_QUERY("### 1.2 Query nonce of " + sourceAddress,
            contractHandler, {
                method: 'nonces',
                params: {
                    account: sourceAddress
                }
            }, TEST_CONDITION.EQUALS, "0");


        const deadline = "1756363348000000";
        const value = "500000000000";

        const PERMIT_TYPEHASH = generateHash("Permit(owner,spender,value,deadline,p,s)");
        const data = PERMIT_TYPEHASH + sourceAddress + sourceAddress1 + value + nonce.toString() + deadline;
        const hash = generateHash(data);
        const signedHash = await signData(sdk, privateKey, hash);

        await TEST_INVOKE("### 1.3 Permit approve function invoked by spender",
            contractHandler, txInitiator1, {
                method: 'permit',
                params: {
                    owner: sourceAddress,
                    spender: sourceAddress1,
                    value: value,
                    deadline: deadline,
                    p: signedHash[0].publicKey,
                    s: signedHash[0].signData
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 1.4 Getting allowance of " + sourceAddress1,
            contractHandler, {
                method: 'allowance',
                params: {
                    owner: sourceAddress,
                    spender: sourceAddress1
                }
            }, TEST_CONDITION.EQUALS, "500000000000");
    });

});
