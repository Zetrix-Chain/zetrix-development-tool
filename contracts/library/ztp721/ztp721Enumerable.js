/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol
 */

import 'utils/basic-operation';
import 'interface/ztp721/IZTP721Enumerable';
import 'library/ztp721/ztp721';

const ZTP721Enumerable = function () {

    const BasicOperationUtil = new BasicOperation();

    const OWNED_TOKENS_PRE = 'owned_tokens'; // key: tokenId
    const OWNED_TOKENS_INDEX_PRE = 'owned_tokens_index'; // key: len
    const ALL_TOKENS = 'all_tokens'; // array
    const ALL_TOKENS_INDEX_PRE = 'all_tokens_index'; // key: len
    const EMPTY_ADDRESS = "0x";

    const self = this;

    ZTP721.call(self);

    // override
    const _supportsInterface = self.supportsInterface;
    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface = Utils.sha256(JSON.stringify(IZTP721Enumerable), 1);
        return interfaceId === iface || _supportsInterface.call(self, paramObj);
    };

    // override
    const _increaseBalance = self.p.increaseBalance;
    self.p.increaseBalance = function (account, amount) {
        Utils.assert(Utils.int64Compare(amount, '0') === 0, 'ERC721Enumerable: Forbidden batch mint');
        _increaseBalance(self, account, amount);
    };

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    const _addTokenToOwnerEnumeration = function (to, tokenId) {

        let length = Utils.int64Sub(self.balanceOf({owner: to}), 1);

        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OWNED_TOKENS_PRE, to, length), {tokenId: tokenId});
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OWNED_TOKENS_INDEX_PRE, tokenId), {len: length});
    };

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    const _addTokenToAllTokensEnumeration = function (tokenId) {
        let allTokens = BasicOperationUtil.loadObj(ALL_TOKENS);
        if (allTokens === false) {
            allTokens = [];
        }
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(ALL_TOKENS_INDEX_PRE, tokenId), {len: allTokens.length});

        allTokens.push(tokenId);
        BasicOperationUtil.saveObj(ALL_TOKENS, allTokens);
    };

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    const _removeTokenFromOwnerEnumeration = function (from, tokenId) {

        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        let lastTokenIndex = self.balanceOf({owner: from});
        let tokenIndex = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(OWNED_TOKENS_INDEX_PRE, tokenId));

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex.len !== lastTokenIndex) {
            let lastTokenId = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(OWNED_TOKENS_PRE, from, lastTokenIndex));
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OWNED_TOKENS_PRE, from, tokenIndex.len), {tokenId: lastTokenId.tokenId});
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OWNED_TOKENS_INDEX_PRE, lastTokenId.tokenId), {len: tokenIndex.len});
        }

        // This also deletes the contents at the last position of the array
        BasicOperationUtil.delObj(BasicOperationUtil.getKey(OWNED_TOKENS_PRE, from, lastTokenIndex));
        BasicOperationUtil.delObj(BasicOperationUtil.getKey(OWNED_TOKENS_INDEX_PRE, tokenId));
    };

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    const _removeTokenFromAllTokensEnumeration = function (tokenId) {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        let allTokens = BasicOperationUtil.loadObj(ALL_TOKENS);
        Utils.assert(allTokens.length > 0, 'ERC721Enumerable: Token index out of bounds');

        let lastTokenIndex = Utils.int64Sub(allTokens.length, 1);
        let tokenIndex = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ALL_TOKENS_INDEX_PRE, tokenId));

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        let lastTokenId = allTokens[lastTokenIndex];

        // Move the last token to the slot of the to-delete token
        allTokens[tokenIndex.len] = lastTokenId;

        // Update the moved token's index
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(ALL_TOKENS_INDEX_PRE, lastTokenId), {len: tokenIndex.len});

        // This also deletes the contents at the last position of the array
        BasicOperationUtil.delObj(BasicOperationUtil.getKey(ALL_TOKENS_INDEX_PRE, tokenId));
        allTokens.pop();

        BasicOperationUtil.saveObj(ALL_TOKENS, allTokens);
    };

    // override
    const _update = self.p.update;
    self.p.update = function (to, tokenId, auth) {
        let previousOwner = _update.call(self, to, tokenId, auth);

        if (previousOwner === EMPTY_ADDRESS) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (previousOwner !== to) {
            _removeTokenFromOwnerEnumeration(previousOwner, tokenId);
        }
        if (to === EMPTY_ADDRESS) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (previousOwner !== to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
        return previousOwner;
    };

    self.tokenOfOwnerByIndex = function (paramObj) {
        Utils.assert(Utils.int64Compare(paramObj.index, self.balanceOf(paramObj)) < 0, 'ERC721Enumerable: Index out of bounds');
        let tokenId = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(OWNED_TOKENS_PRE, paramObj.owner, paramObj.index));
        return tokenId.tokenId;
    };

    self.totalSupply = function () {
        let allToken = BasicOperationUtil.loadObj(ALL_TOKENS);
        return allToken.length;
    };

    self.tokenByIndex = function (paramObj) {
        Utils.assert(Utils.int64Compare(paramObj.index, self.totalSupply()) < 0, 'ERC721Enumerable: Index out of bounds');
        let allToken = BasicOperationUtil.loadObj(ALL_TOKENS);
        return allToken[paramObj.index];
    };

};
