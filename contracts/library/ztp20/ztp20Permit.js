/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20Permit.sol
 */

import 'interface/ztp20/IZTP20Permit';
import 'library/ztp20/ztp20';
import 'library/nonces';

const ZTP20Permit = function () {

    const NoncesLib = new Nonces();

    const PERMIT_TYPEHASH = Utils.sha256("Permit(owner,spender,value,deadline,p,s)", 1);

    const self = this;

    ZTP20.call(self);

    // override
    const _supportsInterface = self.supportsInterface;
    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface = Utils.sha256(JSON.stringify(IZTP20Permit), 1);
        return interfaceId === iface || _supportsInterface.call(self, paramObj);
    };

    /**
     * Processes a permit by validating the signature, verifying ownership, and approving the spender to transfer tokens on behalf of the owner.
     *
     * @param {Object} paramObj The parameter object containing:
     * - owner: The address of the token owner.
     * - spender: The address of the spender who will be approved.
     * - value: The amount of tokens to be approved for transfer.
     * - deadline: The timestamp until which the signature is valid.
     * - p: The public key of the signer.
     * - s: The signature of the permit.
     *
     * @return {void}
     */
    self.permit = function (paramObj) {
        //paramObj : owner, spender, value, deadline, p, s
        Utils.assert(Utils.int64Compare(paramObj.deadline, Chain.block.timestamp) >= 0, 'ZTP20Permit: Expired signature');
        let nonce = NoncesLib.useNonce(paramObj.owner);
        let hash = Utils.sha256(PERMIT_TYPEHASH + paramObj.owner + paramObj.spender + paramObj.value + nonce.toString() + paramObj.deadline, 1);
        let validateSign = Utils.ecVerify(paramObj.s, paramObj.p, hash);
        let validatePubKey = Utils.toAddress(paramObj.p) === paramObj.owner;
        Utils.assert(validateSign && validatePubKey, 'ZTP20Permit: Invalid signer validateSign: ' + validateSign + ', validatePubKey: ' + validatePubKey + ', nonce: ' + nonce.toString() + ', hash: ' + hash);

        self.p.approve(paramObj.owner, paramObj.spender, paramObj.value);
    };

    /**
     * A collection or storage for nonces, typically used to manage unique identifiers
     * to prevent replay attacks or ensure the uniqueness of certain operations.
     *
     * @param {Object} paramObj The parameter object containing:
     * - owner: The address of the token owner.
     *
     * @return {string} nonce value
     */
    self.nonces = function (paramObj) {
        // paramObj : owner
        return NoncesLib.nonces(paramObj.owner);
    };


};
