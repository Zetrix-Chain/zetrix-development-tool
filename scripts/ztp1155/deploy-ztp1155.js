const deployOperation = require("../deploy-operation");
require('dotenv').config({path: ".env"})

const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;
const nodeUrl = process.env.NODE_URL;

const option = process.argv[2];

let contractName = "";
let input = {};

switch (option) {
    case 'core':
        contractName = 'specs/ztp1155/ztp1155-spec.js'
        break;
    case 'pausable':
        contractName = 'specs/ztp1155/ztp1155-pausable-spec.js'
        break;
    case 'burnable':
        contractName = 'specs/ztp1155/ztp1155-burnable-spec.js'
        break;
    case 'supply':
        contractName = 'specs/ztp20/ztp20-supply-spec.js';
        break;
    case 'uri':
        contractName = 'specs/ztp20/ztp20-uri-storage-spec.js';
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

deployOperation(nodeUrl, sourceAddress, privateKey, contractName, input);
