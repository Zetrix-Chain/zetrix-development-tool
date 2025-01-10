# Zetrix Development Tool
A Zetrix development environment for professionals. It facilitates performing frequent tasks, such as compiling smart contract and scripts for deployment and testing.

## Docs & Useful Links

  * [SDK Documentation](https://docs.zetrix.com/en/sdk/node.js)
  * [Zetrix Explorer](https://explorer.zetrix.com)
  * [Zetrix Testnet Faucet](https://faucet.zetrix.com)
  * [Zetrix Smart Contract IDE](https://ide.zetrix.com/)
  * [Zetrix Wallet](https://www.zetrix.com/zetrix-wallet/)


## Getting Started

This is a [Node.js](https://nodejs.org/en/) package available through the
[npm registry](https://www.npmjs.com/). Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.0.0 or higher is required. Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

First, we initialize a NodeJS project by running the following command:
```bash
$ npm init
```

We then install the Zetrix development tool:
```bash
$ npm install zetrix-development-tool
```

We can then run the command to initialize the Zetrix development tool. You need to give your project folder a name, and for the purpose of this example, we will name the folder `template`.
```bash
$ npx zetrix-init template
```

We then update the `scripts` section of the `package.json` with the following:
```js
"scripts": {
    "compile": "concat -o template/build/compiled.js template/contracts/1-base-starting.js template/contracts/2-body-ZTP20.js template/contracts/3-base-ending.js",
    "deploy": "node ./template/scripts/01_deploy.js",
    "test": "npx mocha ./template/tests/test-01.js"
}
```

Update the placeholder [PROJECT NAME] with the name of the folder you have chosen. Remember to also update the placeholder [PROJECT NAME] in the `01_deploy.js` file.

Then create a `.env` file in the root of your project and insert your key/value pairs in the following format of `KEY=VALUE`:

If you're using the Zetrix testnet:
```sh
NODE_URL=test-node.zetrix.com
```

If you're using the Zetrix mainnet:
```sh
NODE_URL=node.zetrix.com
```

Insert the Zetrix address you are going to use to deploy the smart contract from
```sh
ZTX_ADDRESS=[YOUR ZETRIX ADDRESS]
```

Insert the private key of the Zetrix address you are going to use to deploy the smart contract from
```sh
PRIVATE_KEY=[THE PRIVATE KEY TO YOUR ZETRIX ADDRESS]
```

After all of the above have been completed, we can now proceed to compile the smart contract in the contracts folder. In the `scripts` section, the `compile` command essentially compiles the contents from the specified files, so if you have different names for the files or if you would like to add more files to compile, you may do so by adding those file names into the `compile` command, and importantly, in order `base.js` and `init.js` should remain at the top and bottom of the `compiled.js` file respectively). The command by default compiles a standard ZTP-20 smart contract from the `contracts` folder. Once you have updated the command, you can then run:
```sh
$ npm run compile
```

A file named `compiled.js` should be created under the `build` folder. The file will consist of all the contents from the individual files specified in the `compile` command in the `scripts` section of `package.json`.

We can finally deploy the contract with the following command:
```sh
$ npm run deploy
```

Upon successful deployment of the smart contract, the contract address should be printed in the terminal. Copy the contract address upon successful deployment of the smart contract and paste into the `contractAddress` variable in `test-01.js`.

Update the `test-01.js` script to tailor it to test the different functions in your own smart contract. We have given a sample input to call the `testMethod` function under the `2-body-ZTP20.js` file.

We can then run the test with the following command:
```sh
$ npm run test
```

This is the end of the tutorial. Happy coding!

## License

  [MIT](LICENSE)
