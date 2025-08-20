/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Burnable.sol
 */

import 'library/ztp721/ztp721';

const ZTP721Burnable = function () {

    const EMPTY_ADDRESS = "0x";

    const self = this;

    ZTP721.call(self);

    self.p.burn = function (tokenId) {
        self.p.update(EMPTY_ADDRESS, tokenId, Chain.msg.sender);
    };
};