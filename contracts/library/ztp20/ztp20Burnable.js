/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol
 */

import 'interface/IZEP165';
import 'library/ztp20/ztp20';

const ZTP20Burnable = function () {

    const self = this;

    ZTP20.call(self);

    self.burn = function (paramObj) {
        self.p.burn(Chain.msg.sender, paramObj.value);
    };

    self.burnFrom = function (paramObj) {
        self.p.spendAllowance(paramObj.account, Chain.msg.sender, paramObj.value);
        self.p.burn(paramObj.account, paramObj.value);
    };
};
