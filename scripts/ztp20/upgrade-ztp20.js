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
        contractName = 'specs/ztp20/ztp20-spec.js';
        contractAddress = process.env.SPEC_ZTP20;
        break;
    case 'permit':
        contractName = 'specs/ztp20/ztp20-permit-spec.js';
        contractAddress = process.env.SPEC_ZTP20_PERMIT;
        break;
    case 'pausable':
        contractName = 'specs/ztp20/ztp20-pausable-spec.js';
        contractAddress = process.env.SPEC_ZTP20_PAUSABLE;
        break;
    case 'burnable':
        contractName = 'specs/ztp20/ztp20-burnable-spec.js';
        contractAddress = process.env.SPEC_ZTP20_BURNABLE;
        break;
    case 'capped':
        contractName = 'specs/ztp20/ztp20-capped-spec.js';
        contractAddress = process.env.SPEC_ZTP20_CAPPED;
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

upgradeOperation(nodeUrl, sourceAddress, privateKey, contractName, contractAddress);
