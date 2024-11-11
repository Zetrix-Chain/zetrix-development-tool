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
const contractAddress = '';

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
     Specify the input parameters for invoking your contract. The following is just a sample.
     */
    let input = {
      "method": "testMethod",
      "params": {
        "address": "ZTX01ndknae21noBkblwdq2"
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

    /*
     Retrieve the operation 
     */
    const operationItem = contractInvoke.result.operation;
    console.log(operationItem)

    /* 
    Evaluate the fee needed to run the operation. Fee is needed to build the transaction blob
    */
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

    /*
    Build the blob for the transaction
    */
    const blobInfo = sdk.transaction.buildBlob({
      sourceAddress: sourceAddress,
      gasPrice: gasPrice,
      feeLimit: feeLimit,
      nonce: nonce,
      operations: [operationItem],
    });

    console.log(blobInfo);
    expect(blobInfo.errorCode).to.equal(0)

    /*
    Sign the transaction
    */
    const signed = sdk.transaction.sign({
      privateKeys: [privateKey],
      blob: blobInfo.result.transactionBlob
    })

    console.log(signed)
    expect(signed.errorCode).to.equal(0)

    /*
    Submit the transaction
    */
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
