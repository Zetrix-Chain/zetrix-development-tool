'use strict';

import 'utils/basic-operation';
import 'utils/interface';
import 'interface/IZEP165';
import 'interface/ztp721/IZTP721';
import 'interface/ztp721/IZTP721Metadata';
import 'interface/ztp721/IZTP721Enumerable';
import 'library/ztp721/ztp721Enumerable'

const ZTP721Inst = new ZTP721Enumerable();
const BasicOperationUtil = new BasicOperation();

const TOKEN_INDEX = "token_index";

// override
ZTP721Inst.p.baseURI = function () {
    return "https://example-enum.com/";
};

function mint(paramObj) {
    let latestIdx = BasicOperationUtil.loadObj(TOKEN_INDEX);
    if (latestIdx === false) {
        latestIdx = "0";
    }
    latestIdx = Utils.int64Add(latestIdx, "1");
    ZTP721Inst.p.safeMint(paramObj.to, latestIdx);
    BasicOperationUtil.saveObj(TOKEN_INDEX, latestIdx);
}

function burn(paramObj) {
    ZTP721Inst.p.burn(paramObj.tokenId);
}

function safeTransfer(paramObj) {
    ZTP721Inst.p.safeTransfer(paramObj.from, paramObj.to, paramObj.tokenId);
}

function init() {

    ZTP721Inst.p.init(
        "MY NFT",
        "myNFT",
        "My NFT Token"
    );

    Utils.assert(implementsInterface(ZTP721Inst, IZTP721), "ZTP721 class does not implement IZTP721");
    Utils.assert(implementsInterface(ZTP721Inst, IZTP721Metadata), "ZTP721 class does not implement IZTP721Metadata");
    Utils.assert(implementsInterface(ZTP721Inst, IZEP165), "ZTP721 class does not implement IZEP165");
    Utils.assert(implementsInterface(ZTP721Inst, IZTP721Enumerable), "ZTP721 class does not implement IZTP721Enumerable");
    return true;
}

function main(input_str) {
    let funcList = {
        'safeTransferFrom': ZTP721Inst.safeTransferFrom,
        'transferFrom': ZTP721Inst.transferFrom,
        'approve': ZTP721Inst.approve,
        'setApprovalForAll': ZTP721Inst.setApprovalForAll,
        'mint': mint,
        'burn': burn
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
}

function query(input_str) {
    let funcList = {
        'balanceOf': ZTP721Inst.balanceOf,
        'ownerOf': ZTP721Inst.ownerOf,
        'getApproved': ZTP721Inst.getApproved,
        'isApprovedForAll': ZTP721Inst.isApprovedForAll,
        'contractInfo': ZTP721Inst.contractInfo,
        'tokenURI': ZTP721Inst.tokenURI,
        'name': ZTP721Inst.name,
        'symbol': ZTP721Inst.symbol,
        'tokenOfOwnerByIndex': ZTP721Inst.tokenOfOwnerByIndex,
        'totalSupply': ZTP721Inst.totalSupply,
        'tokenByIndex': ZTP721Inst.tokenByIndex,
        'supportsInterface': ZTP721Inst.supportsInterface
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    return JSON.stringify(funcList[inputObj.method](inputObj.params));
}
