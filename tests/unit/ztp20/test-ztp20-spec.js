const {expect} = require("chai");
const sinon = require("sinon");
const Utils = require("../mock/utils.js");
const loader = require("../utils/loader");

const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;

const colorLog = '\x1b[36m%s\x1b[0m';

let query, main, init;

describe('Test contract math', function () {
    this.timeout(30000);

    before(async function () {

        const module = await loader('./contracts/', 'specs/ztp20/ztp20-spec.js');
        query = module.default.query;
        main = module.default.main;
        init = module.default.init;

        init();
    });

    it('1.0 testing contract info function', async () => {

        console.log(colorLog, "### 1.1 Getting contract info");
        let input = {
            method: 'contractInfo'
        };
        let result = query(JSON.stringify(input));

        expect(JSON.parse(result).name).to.equal("MY TOKEN");
    });

    [1, 2, 3].forEach(value => {
        it('2.0 testing mint function', async () => {

            console.log(colorLog, "### 2." + value + " Minting token count " + value);
            let input = {
                method: 'mint',
                params: {
                    account: sourceAddress,
                    value: "1000000000000"
                }
            };
            main(JSON.stringify(input));

        });
    });

    it('3.0 testing get balance of function', async () => {

        console.log(colorLog, "### 3.1 Getting balance of " + sourceAddress);
        let input = {
            method: 'balanceOf',
            params: {
                account: sourceAddress
            }
        };
        let result = query(JSON.stringify(input));

        expect(JSON.parse(result)).to.equal("3000000000000");
    });
});
