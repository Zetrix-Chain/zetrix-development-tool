const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const sleep = require("../utils/delay");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();

/*
 Specify the zetrix address and private key
 */
const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;

/*
 Specify the smart contract address
 */
const contractAddress = 'ZTX3LJtVUun23okUNYXQ1n3NNBSAt1vMUbwk4';

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
  host: process.env.NODE_URL,
  secure: false /* set to false if without SSL */
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

describe('Test contract function #01', function () {
  this.timeout(30000);

  it('testing input parameter', function* () {

    const nonceResult = yield sdk.account.getNonce(sourceAddress);

    expect(nonceResult.errorCode).to.equal(0)

    let nonce = nonceResult.result.nonce;
    nonce = new BigNumber(nonce).plus(1).toString(10);

    /*
     Specify the input parameters for invoking contract
     */
    let input = {
      "method": "testMethod",
      "params": {
        "name": "Zetrix"
      }
    }

    let contractInvoke = yield sdk.operation.contractInvokeByGasOperation({
      contractAddress,
      sourceAddress,
      gasAmount: '0',
      input: JSON.stringify(input),
    });

    console.log(contractInvoke)

    expect(contractInvoke.errorCode).to.equal(0)

    const operationItem = contractInvoke.result.operation;

    console.log(operationItem)

    let feeData = yield sdk.transaction.evaluateFee({
      sourceAddress,
      nonce,
      operations: [operationItem],
      signtureNumber: '100',
    });
    console.log(feeData)
    expect(feeData.errorCode).to.equal(0)

    let feeLimit = feeData.result.feeLimit;
    let gasPrice = feeData.result.gasPrice;

    console.log("gasPrice", gasPrice);
    console.log("feeLimit", feeLimit);

    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: sourceAddress,
      gasPrice: gasPrice,
      feeLimit: feeLimit,
      nonce: nonce,
      operations: [operationItem],
    });

    console.log(blobInfo);
    expect(blobInfo.errorCode).to.equal(0)

    const signed = sdk.transaction.sign({
      privateKeys: [privateKey],
      blob: blobInfo.result.transactionBlob
    })

    console.log(signed)
    expect(signed.errorCode).to.equal(0)

    let submitted = yield sdk.transaction.submit({
      signature: signed.result.signatures,
      blob: blobInfo.result.transactionBlob
    })

    console.log(submitted)
    expect(submitted.errorCode).to.equal(0)

    let info = null;
    for (let i = 0; i < 10; i++) {
      console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
      info = yield sdk.transaction.getInfo(submitted.result.hash)
      if (info.errorCode === 0) {
        break;
      }
      sleep(2000);
    }

    expect(info.errorCode).to.equal(0)

  });
});
