'use strict';

import 'library/math'

const MathLib = new Math();

function init() {
    return true;
}

function main(input_str) {
    let input = JSON.parse(input_str);
    let params = input.params;

    throw 'Unknown operating: ' + input.method + '.';
}

function query(input_str) {
    let input = JSON.parse(input_str);
    let params = input.params;

    let result = {};
    if (input.method === 'pow') {
        result.data = MathLib.pow(params.base, params.exp);
    } else if (input.method === 'sqrt') {
        result.data = MathLib.sqrt(params.x);
    } else if (input.method === 'min') {
        result.data = MathLib.min(params.x, params.y);
    } else if (input.method === 'max') {
        result.data = MathLib.max(params.x, params.y);
    } else {
        throw 'Unknown operating: ' + input.method + '.';
    }

    return JSON.stringify(result);
}
