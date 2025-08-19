# Zetrix Development Tool
A Zetrix development environment for professionals. It facilitates performing frequent tasks, such as smart contract deployment and testing.

## Docs & Useful Links

  * [SDK Documentation](https://docs.zetrix.com/en/sdk/node.js)
  * [Zetrix Explorer](https://explorer.zetrix.com)
  * [Zetrix Testnet Faucet](https://faucet.zetrix.com)
  * [Zetrix Smart Contract IDE](https://ide.zetrix.com/)
  * [Zetrix Wallet](https://www.zetrix.com/zetrix-wallet/)


## Getting Started
This repository can be cloned to your local machine and it can be used a base project for your own smart contract development on Zetrix.

After cloning the repository, we install the NPM packages for this project by running the following command:
```bash
$ npm install
```

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
ZTX_ADDRESS=<YOUR ZETRIX ADDRESS>
```

Insert the private key of the Zetrix address you are going to use to deploy the smart contract from
```sh
PRIVATE_KEY=<THE PRIVATE KEY TO YOUR ZETRIX ADDRESS>
```

In the `deploy.js` file, it deploys a standard ZTP-20 smart contract from the `contracts` folder. Contract deployment can be done by running the following command:
```sh
$ npm run deploy
```

Upon successful deployment of the smart contract, the contract address should be printed in the terminal. Copy the contract address upon successful deployment of the smart contract and paste into the `contractAddress` variable in `test.js`.

Update the `test.js` script to tailor it to test the different functions in your own smart contract. 

We can then run the test with the following command:
```sh
$ npm run test
```

This is the end of the tutorial. Happy coding!

## License

  [MIT](LICENSE)
