const {expect} = require("chai");
const sinon = require("sinon");
const Utils = require("./mock/utils.js");
const loader = require("./utils/loader");

let query, main, init;

describe('Test contract math', function () {
    this.timeout(30000);

    before(async function () {

        const module = await loader('./contracts/', 'specs/math-spec.js');
        query = module.default.query;
        main = module.default.main;
        init = module.default.init;

        init();
    });

    it('testing pow function', async () => {

        const spy = sinon.spy(Utils, "int256Mul");

        let input = {
            method: 'pow',
            params: {
                base: "10",
                exp: "2"
            }
        };
        let result = query(JSON.stringify(input));

        expect(spy.callCount).to.equal(2);
        expect(JSON.parse(result).data).to.equal("100");
    });

    it('testing sqrt function', async () => {

        // const spy = sinon.spy(Utils, "int256Mul");

        let input = {
            method: 'sqrt',
            params: {
                x: "144"
            }
        };
        let result = query(JSON.stringify(input));

        // expect(spy.callCount).to.equal(2);
        expect(JSON.parse(result).data).to.equal("12");
    });

    it('testing min function', async () => {

        // const spy = sinon.spy(Utils, "int256Mul");

        let input = {
            method: 'min',
            params: {
                x: "144",
                y: "122"
            }
        };
        let result = query(JSON.stringify(input));

        // expect(spy.callCount).to.equal(2);
        expect(JSON.parse(result).data).to.equal("122");
    });

    it('testing max function', async () => {

        // const spy = sinon.spy(Utils, "int256Mul");

        let input = {
            method: 'max',
            params: {
                x: "144",
                y: "122"
            }
        };
        let result = query(JSON.stringify(input));

        // expect(spy.callCount).to.equal(2);
        expect(JSON.parse(result).data).to.equal("144");
    });
});
