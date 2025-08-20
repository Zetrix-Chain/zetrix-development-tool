/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Burnable.sol
 */

import 'library/ztp1155/ztp1155';

const ZTP1155Burnable = function () {

    const self = this;

    ZTP1155.call(self);

    // override
    const _burn = self.p.burn;
    self.p.burn = function (account, id, value) {
        Utils.assert(account === Chain.msg.sender || self.isApprovedForAll({
            owner: account,
            operator: Chain.msg.sender
        }), 'Missing approval for all');
        _burn.call(self, account, id, value);
    };

    // override
    const _burnBatch = self.p.burnBatch;
    self.p.burnBatch = function (account, ids, values) {
        Utils.assert(account === Chain.msg.sender || self.isApprovedForAll({
            owner: account,
            operator: Chain.msg.sender
        }), 'Missing approval for all');
        _burnBatch.call(self, account, ids, values);
    };
};
