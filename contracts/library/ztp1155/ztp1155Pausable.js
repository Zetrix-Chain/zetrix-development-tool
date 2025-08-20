/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Pausable.sol
 */

import 'library/ztp1155/ztp1155';
import 'library/pausable';

const ZTP1155Pausable = function () {

    const self = this;

    ZTP1155.call(self);
    Pausable.call(self);

    // override
    const _update = self.p.update;
    self.p.update = function (from, to, ids, values) {
        self.whenNotPaused();
        return _update.call(self, from, to, ids, values);
    };
};
