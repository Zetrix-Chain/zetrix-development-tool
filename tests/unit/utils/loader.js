const beautifyData = require("../../../utils/beautify");
const merge = require("../../../utils/merge");
const fs = require("fs");
const { createInstrumenter } = require('istanbul-lib-instrument');

const instrumenter = createInstrumenter();

async function loader(baseDir, fn) {

    let contractData = beautifyData(merge(baseDir, fs.readFileSync(baseDir + fn, 'utf8')));

    contractData = "import Utils from \"../tests/unit/mock/utils.js\";\nimport Chain from \"../tests/unit/mock/chain.js\";\n\n" + contractData + "\n\nexport default { query, main, init };";

    await fs.writeFile('./generated/test-merged-contract.mjs', contractData, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
    });

    const instrumentedCode = instrumenter.instrumentSync(
        contractData,
        './generated/test-merged-contract.mjs' // File path for instrumentation
    );

    await fs.writeFile('./generated/test-merged-contract-inst.mjs', instrumentedCode, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
    });

    return await import('../../../generated/test-merged-contract-inst.mjs');
}

module.exports = loader;
