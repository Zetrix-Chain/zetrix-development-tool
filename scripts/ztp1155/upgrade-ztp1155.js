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
        contractName = 'specs/ztp1155/ztp1155-spec.js';
        contractAddress = process.env.SPEC_ZTP1155;
        break;
    case 'pausable':
        contractName = 'specs/ztp1155/ztp1155-pausable-spec.js'
        contractAddress = process.env.SPEC_ZTP1155_PAUSABLE;
        break;
    case 'burnable':
        contractName = 'specs/ztp1155/ztp1155-burnable-spec.js'
        contractAddress = process.env.SPEC_ZTP1155_BURNABLE;
        break;
    case 'supply':
        contractName = 'specs/ztp1155/ztp1155-supply-spec.js'
        contractAddress = process.env.SPEC_ZTP1155_SUPPLY;
        break;
    case 'uri':
        contractName = 'specs/ztp1155/ztp1155-uri-storage-spec.js'
        contractAddress = process.env.SPEC_ZTP1155_URI;
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

upgradeOperation(nodeUrl, sourceAddress, privateKey, contractName, contractAddress);
