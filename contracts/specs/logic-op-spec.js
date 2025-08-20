'use strict';

import 'library/logic-op'

const LogicOpLib = new LogicOp();

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
    if (input.method === 'bitwiseAnd') {
        result.data = LogicOpLib.bitwiseAnd(params.a, params.b);
    } else if (input.method === 'bitwiseOr') {
        result.data = LogicOpLib.bitwiseOr(params.a, params.b);
    } else if (input.method === 'leftShift') {
        result.data = LogicOpLib.leftShift(params.value, params.shiftBy);
    } else if (input.method === 'rightShift') {
        result.data = LogicOpLib.rightShift(params.value, params.shiftBy);
    } else {
        throw 'Unknown operating: ' + input.method + '.';
    }

    return JSON.stringify(result);
}
