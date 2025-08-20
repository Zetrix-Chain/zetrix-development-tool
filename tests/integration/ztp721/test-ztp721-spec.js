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

describe('Test contract ztp721', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-spec.js'
        let input = {};
        contractHandler.contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractHandler.contractAddress);
    });

    it('1.0 testing contract info function', async () => {

        await TEST_QUERY("### 1.1 Getting contract info",
            contractHandler, {
                method: 'contractInfo'
            }, TEST_CONDITION.EQUALS, "MY NFT", 'name');
    });

    [1, 2, 3].forEach(value => {
        it('2.0 testing mint function', async () => {

            await TEST_INVOKE("### 2." + value + " Minting token " + value,
                contractHandler, txInitiator, {
                    method: 'mint',
                    params: {
                        to: sourceAddress
                    }
                }, TEST_RESULT.SUCCESS);
        })
    });

    it('3.0 testing token uri function', async () => {

        await TEST_QUERY("### 3.1 Getting token uri",
            contractHandler, {
                method: 'tokenURI',
                params: {
                    tokenId: "1"
                }
            }, TEST_CONDITION.EQUALS, "https://example.com/1");
    });

    it('4.0 testing approve function', async () => {

        await TEST_INVOKE("### 4.1 Approving token",
            contractHandler, txInitiator, {
                method: 'approve',
                params: {
                    to: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                    tokenId: "1"
                }
            }, TEST_RESULT.SUCCESS);
    });

    it('5.0 testing get approved function', async () => {

        await TEST_QUERY("### 5.1 Getting approved token",
            contractHandler, {
                method: 'getApproved',
                params: {
                    tokenId: "1"
                }
            }, TEST_CONDITION.EQUALS, "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi");
    });

    it('6.0 testing get is approved for all function', async () => {

        await TEST_QUERY("### 6.1 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi"
                }
            }, TEST_CONDITION.EQUALS, false);
    });

    it('7.0 testing get balance of function', async () => {

        await TEST_QUERY("### 7.1 Getting balance of " + sourceAddress,
            contractHandler, {
                method: 'balanceOf',
                params: {
                    owner: sourceAddress
                }
            }, TEST_CONDITION.GREATER_THAN_OR_EQUAL, 1, "", "NUMBER");
    });

    it('8.0 testing get owner of function', async () => {

        await TEST_QUERY("### 8.1 Getting owner of token",
            contractHandler, {
                method: 'ownerOf',
                params: {
                    tokenId: "1"
                }
            }, TEST_CONDITION.EQUALS, sourceAddress);
    });

    it('9.0 testing get name function', async () => {

        await TEST_QUERY("### 9.1 Getting name",
            contractHandler, {
                method: 'name'
            }, TEST_CONDITION.EQUALS, "MY NFT");
    });

    it('10.0 testing get symbol function', async () => {

        await TEST_QUERY("### 9.1 Getting symbol",
            contractHandler, {
                method: 'symbol'
            }, TEST_CONDITION.EQUALS, "myNFT");
    });

    it('11.0 testing safe transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "1";

        await TEST_INVOKE("### 11.1 Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient,
            contractHandler, txInitiator, {
                method: 'safeTransferFrom',
                params: {
                    from: sourceAddress,
                    to: recipient,
                    tokenId: tokenId
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 11.2 Getting owner of token " + tokenId,
            contractHandler, {
                method: 'ownerOf',
                params: {
                    tokenId: tokenId
                }
            }, TEST_CONDITION.EQUALS, "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi");
    });

    it('12.0 testing transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";

        await TEST_INVOKE("### 12.1 Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient,
            contractHandler, txInitiator, {
                method: 'transferFrom',
                params: {
                    from: sourceAddress,
                    to: recipient,
                    tokenId: tokenId
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 12.2 Getting owner of token " + tokenId,
            contractHandler, {
                method: 'ownerOf',
                params: {
                    tokenId: tokenId
                }
            }, TEST_CONDITION.EQUALS, recipient);
    });

    it('13.0 testing set approval for all from function', async () => {

        let operator = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";

        await TEST_INVOKE("### 13.1 Setting approval for all from " + sourceAddress + " to " + operator,
            contractHandler, txInitiator, {
                method: 'setApprovalForAll',
                params: {
                    operator: operator,
                    approved: true
                }
            }, TEST_RESULT.SUCCESS);

        await TEST_QUERY("### 13.2 Getting is approved for all",
            contractHandler, {
                method: 'isApprovedForAll',
                params: {
                    owner: sourceAddress,
                    operator: operator
                }
            }, TEST_CONDITION.EQUALS, true);
    });

    it('14.0 testing burn function', async () => {

        await TEST_INVOKE("### 14.1 Burning token",
            contractHandler, txInitiator, {
                method: 'burn',
                params: {
                    tokenId: "2"
                }
            }, TEST_RESULT.SUCCESS);
    });

});
