'use strict';

import 'utils/basic-operation'
import 'utils/interface';
import 'interface/IZEP165';
import 'interface/ztp1155/IZTP1155';
import 'interface/ztp1155/IZTP1155MetadataURI';
import 'library/ztp1155/ztp1155Supply'

const ZTP1155Inst = new ZTP1155Supply();

function mint(paramObj) {
    ZTP1155Inst.p.mint(paramObj.to, paramObj.id, paramObj.value);
}

function mintBatch(paramObj) {
    ZTP1155Inst.p.mintBatch(paramObj.to, paramObj.ids, paramObj.values);
}

function burn(paramObj) {
    ZTP1155Inst.p.burn(paramObj.from, paramObj.id, paramObj.value);
}

function burnBatch(paramObj) {
    ZTP1155Inst.p.burnBatch(paramObj.from, paramObj.ids, paramObj.values);
}

function init() {

    ZTP1155Inst.p.init(
        'https://example.com/',
        'MY 1155',
        "my1155",
        "My 1155 Token"
    );

    Utils.assert(implementsInterface(ZTP1155Inst, IZTP1155), "ZTP1155 class does not implement IZTP1155");
    Utils.assert(implementsInterface(ZTP1155Inst, IZTP1155MetadataURI), "ZTP1155 class does not implement IZTP1155MetadataURI");
    Utils.assert(implementsInterface(ZTP1155Inst, IZEP165), "ZTP1155 class does not implement IZEP165");
    return true;
}

function main(input_str) {
    let funcList = {
        'setApprovalForAll': ZTP1155Inst.setApprovalForAll,
        'safeTransferFrom': ZTP1155Inst.safeTransferFrom,
        'safeBatchTransferFrom': ZTP1155Inst.safeBatchTransferFrom,
        'mint': mint,
        'mintBatch': mintBatch,
        'burn': burn,
        'burnBatch': burnBatch
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
}

function query(input_str) {
    let funcList = {
        'uri': ZTP1155Inst.uri,
        'balanceOf': ZTP1155Inst.balanceOf,
        'balanceOfBatch': ZTP1155Inst.balanceOfBatch,
        'exist': ZTP1155Inst.exist,
        'totalSupply': ZTP1155Inst.totalSupply,
        'isApprovedForAll': ZTP1155Inst.isApprovedForAll,
        'contractInfo': ZTP1155Inst.contractInfo,
        'supportsInterface': ZTP1155Inst.supportsInterface
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    return JSON.stringify(funcList[inputObj.method](inputObj.params));
}
