/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Pausable.sol
 */

import 'library/ztp721/ztp721';
import 'library/pausable';

const ZTP721Pausable = function () {

    const self = this;

    ZTP721.call(self);
    Pausable.call(self);

    // override
    const _update = self.p.update;
    self.p.update = function (to, tokenId, auth) {
        self.whenNotPaused();
        return _update.call(self, to, tokenId, auth);
    };
};
