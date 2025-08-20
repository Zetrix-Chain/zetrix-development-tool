/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Pausable.sol
 */

import 'library/ztp20/ztp20';
import 'library/pausable';

const ZTP20Pausable = function () {

    const self = this;

    ZTP20.call(self);
    Pausable.call(self);

    // override
    const _update = self.p.update;
    self.p.update = function (from, to, value) {
        self.whenNotPaused();
        return _update.call(self, from, to, value);
    };
};
