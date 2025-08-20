'use strict';

import 'library/bytes'

const BytesLib = new Bytes();

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
    if (input.method === 'num2bin') {
        result.data = BytesLib.num2bin(params.num, params.length);
    } else if (input.method === 'reverseBytes') {
        result.data = BytesLib.reverseBytes(params.binaryStr, params.length);
    } else {
        throw 'Unknown operating: ' + input.method + '.';
    }

    return JSON.stringify(result);
}
