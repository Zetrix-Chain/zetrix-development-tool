const deployOperation = require("../deploy-operation");
const upgradeOperation = require("../upgrade-operation");
require('dotenv').config({path: ".env"})

const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;
const nodeUrl = process.env.NODE_URL;

const option = process.argv[2];

let contractName = "";
let contractAddress = "";

switch (option) {
    case 'core':
        contractName = 'specs/ztp721/ztp721-spec.js';
        contractAddress = process.env.SPEC_ZTP721;
        break;
    case 'pausable':
        contractName = 'specs/ztp721/ztp721-pausable-spec.js'
        contractAddress = process.env.SPEC_ZTP721_PAUSABLE;
        break;
    case 'burnable':
        contractName = 'specs/ztp721/ztp721-burnable-spec.js'
        contractAddress = process.env.SPEC_ZTP721_BURNABLE;
        break;
    case 'enumerable':
        contractName = 'specs/ztp721/ztp721-enumerable-spec.js'
        contractAddress = process.env.SPEC_ZTP721_ENUMERABLE;
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

upgradeOperation(nodeUrl, sourceAddress, privateKey, contractName, contractAddress);
