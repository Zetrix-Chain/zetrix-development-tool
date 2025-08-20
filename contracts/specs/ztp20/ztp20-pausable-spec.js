'use strict';

import 'utils/basic-operation'
import 'utils/interface';
import 'interface/IZEP165';
import 'interface/ztp20/IZTP20';
import 'interface/ztp20/IZTP20Metadata';
import 'library/ztp20/ztp20Pausable'

const ZTP20Inst = new ZTP20Pausable();

function mint(paramObj) {
    ZTP20Inst.p.mint(paramObj.account, paramObj.value);
}

function burn(paramObj) {
    ZTP20Inst.p.burn(paramObj.account, paramObj.value);
}

function init() {

    ZTP20Inst.p.init(
        "MY TOKEN",
        "myTKN",
        "My Token"
    );

    Utils.assert(implementsInterface(ZTP20Inst, IZTP20), "ZTP20 class does not implement IZTP20");
    Utils.assert(implementsInterface(ZTP20Inst, IZTP20Metadata), "ZTP20 class does not implement IZTP20Metadata");
    Utils.assert(implementsInterface(ZTP20Inst, IZEP165), "ZTP20 class does not implement IZEP165");
    return true;
}

function main(input_str) {
    let funcList = {
        'transfer': ZTP20Inst.transfer,
        'approve': ZTP20Inst.approve,
        'transferFrom': ZTP20Inst.transferFrom,
        'mint': mint,
        'burn': burn,
        'pause': ZTP20Inst.pause,
        'unpause': ZTP20Inst.unpause
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
}

function query(input_str) {
    let funcList = {
        'totalSupply': ZTP20Inst.totalSupply,
        'balanceOf': ZTP20Inst.balanceOf,
        'allowance': ZTP20Inst.allowance,
        'contractInfo': ZTP20Inst.contractInfo,
        'name': ZTP20Inst.name,
        'symbol': ZTP20Inst.symbol,
        'decimals': ZTP20Inst.decimals,
        'supportsInterface': ZTP20Inst.supportsInterface
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    return JSON.stringify(funcList[inputObj.method](inputObj.params));
}
