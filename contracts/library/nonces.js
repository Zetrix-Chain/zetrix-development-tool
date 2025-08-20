/**
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Nonces.sol
 */

const Nonces = function () {

    const BasicOperationUtil = new BasicOperation();

    const NONCES = "nonce";

    const self = this;

    self.nonces = function (owner) {
        let nonce = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(NONCES, owner));
        if (nonce === false) {
            nonce = "0";
        }
        return nonce;
    };

    self.useNonce = function (owner) {
        let nonce = self.nonces(owner);
        let newNonce = Utils.int64Add(nonce, "1");
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(NONCES, owner), newNonce);
        return nonce;
    };

    self.useCheckedNonce = function (owner, nonce) {
        let current = self.useNonce(owner);
        Utils.assert(nonce === current, 'Invalid account nonce, owner: ' + owner + ', current: ' + current);
    };
};
