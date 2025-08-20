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
        contractName = 'specs/ztp721/ztp721-spec.js'
        break;
    case 'pausable':
        contractName = 'specs/ztp721/ztp721-pausable-spec.js'
        break;
    case 'burnable':
        contractName = 'specs/ztp721/ztp721-burnable-spec.js'
        break;
    case 'enumerable':
        contractName = 'specs/ztp20/ztp20-enumerable-spec.js';
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

deployOperation(nodeUrl, sourceAddress, privateKey, contractName, input);
