/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Supply.sol
 */

import 'utils/basic-operation'
import 'library/ztp1155/ztp1155';

const ZTP1155Supply = function () {

    const BasicOperationUtil = new BasicOperation();

    const TOTAL_SUPPLY_PRE = 'total_supply';
    const TOTAL_SUPPLY_ALL = 'total_supply_all';
    const EMPTY_ADDRESS = "0x";

    const self = this;

    ZTP1155.call(self);

    self.totalSupply = function (paramObj) {
        let supply = "0";
        if (paramObj === undefined || paramObj.id === undefined || paramObj.id.length === 0) {
            let sAll = BasicOperationUtil.loadObj(TOTAL_SUPPLY_ALL);
            if (sAll !== false) {
                supply = sAll;
            }
        } else {
            let sPre = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, paramObj.id));
            if (sPre !== false) {
                supply = sPre;
            }
        }
        return supply;
    };

    self.exist = function (paramObj) {
        let supply = self.totalSupply(paramObj);
        return supply !== false;
    };

    // override
    const _update = self.p.update;
    self.p.update = function (from, to, ids, values) {
        _update.call(self, from, to, ids, values);

        if (from === EMPTY_ADDRESS) {
            let totalMintValue = '0';
            let i;
            for (i = 0; i < ids.length; i += 1) {
                let valueFrom = values[i];
                let totalSupplyFrom = self.totalSupply({id: ids[i]});
                totalSupplyFrom = Utils.int256Add(totalSupplyFrom, valueFrom);
                BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[i]), totalSupplyFrom);
                totalMintValue = Utils.int256Add(totalMintValue, valueFrom);
            }
            let totalSupplyAllFrom = self.totalSupply();
            totalSupplyAllFrom = Utils.int256Add(totalSupplyAllFrom, totalMintValue);
            BasicOperationUtil.saveObj(TOTAL_SUPPLY_ALL, totalSupplyAllFrom);
        }

        if (to === EMPTY_ADDRESS) {
            let totalBurnValue = '0';
            let j;
            for (j = 0; j < ids.length; j += 1) {
                let valueTo = values[j];
                let totalSupplyTo = self.totalSupply({id: ids[j]});
                totalSupplyTo = Utils.int256Sub(totalSupplyTo, valueTo);
                BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[j]), totalSupplyTo);
                totalBurnValue = Utils.int256Add(totalBurnValue, valueTo);
            }
            let totalSupplyAllTo = self.totalSupply();
            totalSupplyAllTo = Utils.int256Sub(totalSupplyAllTo, totalBurnValue);
            BasicOperationUtil.saveObj(TOTAL_SUPPLY_ALL, totalSupplyAllTo);
        }
    };

};
