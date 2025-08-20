/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Capped.sol
 */

import 'utils/basic-operation'
import 'interface/IZEP165';
import 'library/ztp20/ztp20';

const ZTP20Capped = function () {

    const BasicOperationUtil = new BasicOperation();

    const CAP_VALUE = "cap";
    const EMPTY_ADDRESS = "0x";

    const self = this;

    ZTP20.call(self);

    const _init = self.p.init;
    self.p.init = function (name, symbol, describe, cap) {
        _init(name, symbol, describe);
        Utils.assert(Utils.int256Compare(cap, '0') > 0, 'Invalid cap');
        BasicOperationUtil.saveObj(CAP_VALUE, cap);
    };

    self.cap = function () {
        return BasicOperationUtil.loadObj(CAP_VALUE);
    };

    const _update = self.p.update;
    self.p.update = function (from, to, value) {
        _update(from, to, value);

        if (from === EMPTY_ADDRESS) {
            let maxSupply = self.cap();
            let supply = self.totalSupply();
            Utils.assert(Utils.int256Compare(supply, maxSupply) <= 0, 'Exceeded cap value supply: ' + supply + ' cap: ' + maxSupply);
        }
    };
};
