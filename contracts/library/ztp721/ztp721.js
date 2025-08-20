/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
 */

import 'utils/basic-operation'
import 'interface/IZEP165';
import 'interface/ztp721/IZTP721';
import 'interface/ztp721/IZTP721Metadata';

const ZTP721 = function () {

    const BasicOperationUtil = new BasicOperation();

    const BALANCES_PRE = 'balances';
    const OWNERS_PRE = 'owner';
    const TOKEN_APPROVAL_PRE = 'token_approval';
    const OPERATOR_APPROVAL_PRE = 'operator_approval';
    const CONTRACT_INFO = 'contract_info';
    const ZTP_PROTOCOL = 'ztp721';
    const EMPTY_ADDRESS = "0x";

    const self = this;

    self.p = {/*protected function*/};

    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface1 = Utils.sha256(JSON.stringify(IZEP165), 1);
        let iface2 = Utils.sha256(JSON.stringify(IZTP721), 1);
        let iface3 = Utils.sha256(JSON.stringify(IZTP721Metadata), 1);
        return interfaceId === iface1 || interfaceId === iface2 || interfaceId === iface3;
    };

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    self.p.baseURI = function () {
        return "";
    };

    /**
     * @dev Returns the owner of the `tokenId`. Does NOT revert if token doesn't exist
     *
     * IMPORTANT: Any overrides to this function that add ownership of tokens not tracked by the
     * core ERC-721 logic MUST be matched with the use of {_increaseBalance} to keep balances
     * consistent with ownership. The invariant to preserve is that for any address `a` the value returned by
     * `balanceOf(a)` must be equal to the number of tokens such that `self.p.ownerOf(tokenId)` is `a`.
     */
    self.p.ownerOf = function (tokenId) {
        let owner = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(OWNERS_PRE, tokenId));
        if (owner === false) {
            return EMPTY_ADDRESS;
        }
        return owner;
    };

    /**
     * @dev Reverts if the `tokenId` doesn't have a current owner (it hasn't been minted, or it has been burned).
     * Returns the owner.
     *
     * Overrides to ownership logic should be done to {self.p.ownerOf}.
     */
    const _requiredOwned = function (tokenId) {
        let owner = self.p.ownerOf(tokenId);
        Utils.assert(Utils.addressCheck(owner), 'ERC721: Owner query for nonexistent token');
        return owner;
    };

    /**
     * @dev Returns the approved address for `tokenId`. Returns 0 if `tokenId` is not minted.
     */
    self.p.getApproved = function (tokenId) {
        let approvedAddress = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_APPROVAL_PRE, tokenId));
        if (approvedAddress === false) {
            return EMPTY_ADDRESS;
        }
        return approvedAddress;
    };

    /**
     * @dev Returns whether `spender` is allowed to manage `owner`'s tokens, or `tokenId` in
     * particular (ignoring whether it is owned by `owner`).
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    self.p.isAuthorized = function (owner, spender, tokenId) {
        return spender !== '' && (owner === spender || self.p.getApproved(tokenId) === spender || self.isApprovedForAll(owner, spender));
    };

    /**
     * @dev Checks if `spender` can operate on `tokenId`, assuming the provided `owner` is the actual owner.
     * Reverts if:
     * - `spender` does not have approval from `owner` for `tokenId`.
     * - `spender` does not have approval to manage all of `owner`'s assets.
     *
     * WARNING: This function assumes that `owner` is the actual owner of `tokenId` and does not verify this
     * assumption.
     */
    self.p.checkAuthorized = function (owner, spender, tokenId) {
        if (!self.p.isAuthorized(owner, spender, tokenId)) {
            Utils.assert(Utils.addressCheck(owner), "ERC721: None existent token");
            Utils.assert(false, "ERC721: Insufficient approval");
        }
    };

    /**
     * @dev Variant of `self.p.approve` with an optional flag to enable or disable the {Approval} event. The event is not
     * emitted in the context of transfers.
     */
    self.p.approve = function (to, tokenId, auth, emitEvent = true) {
        if (emitEvent || Utils.addressCheck(auth)) {
            let owner = _requiredOwned(tokenId);

            if (Utils.addressCheck(auth) && owner !== auth && !self.isApprovedForAll(owner, auth)) {
                Utils.assert(false, "ERC721: Invalid approver");
            }

            if (emitEvent) {
                Chain.tlog('Approval', owner, to, tokenId);
            }
        }
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_APPROVAL_PRE, tokenId), to);
    };

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Requirements:
     * - operator can't be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    self.p.setApprovalForAll = function (owner, operator, approved) {
        Utils.assert(Utils.addressCheck(operator), "ERC721: Invalid operator");
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OPERATOR_APPROVAL_PRE, owner, operator), approved);
        Chain.tlog('ApprovalForAll', owner, operator, approved);
    };


    /**
     * @dev Transfers `tokenId` from its current owner to `to`, or alternatively mints (or burns) if the current owner
     * (or `to`) is the zero address. Returns the owner of the `tokenId` before the update.
     *
     * The `auth` argument is optional. If the value passed is non 0, then this function will check that
     * `auth` is either the owner of the token, or approved to operate on the token (by the owner).
     *
     * Emits a {Transfer} event.
     *
     * NOTE: If overriding this function in a way that tracks balances, see also {_increaseBalance}.
     */
    self.p.update = function (to, tokenId, auth) {
        let from = self.p.ownerOf(tokenId);

        // Perform (optional) operator check
        if (Utils.addressCheck(auth)) {
            self.p.checkAuthorized(from, auth, tokenId);
        }

        // Execute the update
        if (Utils.addressCheck(from)) {
            // Clear approval. No need to re-authorize or emit the Approval event
            self.p.approve(EMPTY_ADDRESS, tokenId, EMPTY_ADDRESS, false);

            let balFrom = self.balanceOf({owner: from});
            if (Utils.int64Compare(balFrom, '0') > 0) {
                BasicOperationUtil.saveObj(BasicOperationUtil.getKey(BALANCES_PRE, from), Utils.int64Sub(balFrom, '1'));
            }
        }

        if (Utils.addressCheck(to)) {
            let balTo = self.balanceOf({owner: to});
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(BALANCES_PRE, to), Utils.int64Add(balTo, '1'));
        }

        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(OWNERS_PRE, tokenId), to);

        Chain.tlog('Transfer', from, to, tokenId);

        return from;
    };
    /**
     * @dev Unsafe write access to the balances, used by extensions that "mint" tokens using an {ownerOf} override.
     *
     * NOTE: the value is limited to type(uint128).max. This protect against _balance overflow. It is unrealistic that
     * a uint256 would ever overflow from increments when these increments are bounded to uint128 values.
     *
     * WARNING: Increasing an account's balance using this function tends to be paired with an override of the
     * {self.p.ownerOf} function to resolve the ownership of the corresponding tokens so that balances and ownership
     * remain consistent with one another.
     */
    self.p.increaseBalance = function (account, value) {
        let balance = self.balanceOf({owner: account});
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(BALANCES_PRE, account), Utils.int64Add(balance, value));
    };


    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    const _mint = function (to, tokenId) {
        Utils.assert(Utils.addressCheck(to), "ERC721: Invalid receiver");
        let previousOwner = self.p.update(to, tokenId, EMPTY_ADDRESS);
        Utils.assert(previousOwner === EMPTY_ADDRESS, "ERC721: Invalid sender");
    };

    /**
     * @dev Mints `tokenId`, transfers it to `to` and checks for `to` acceptance.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    self.p.safeMint = function (to, tokenId, data = "") {
        _mint(to, tokenId);
        /*
        if(data !== "") {
            // Implement checkOnERC721Received
        }
         */
    };

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     * This is an internal function that does not check if the sender is authorized to operate on the token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    self.p.burn = function (tokenId) {
        let previousOwner = self.p.update(EMPTY_ADDRESS, tokenId, EMPTY_ADDRESS);
        Utils.assert(Utils.addressCheck(previousOwner), "ERC721: Non existent token");
    };

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    const _transfer = function (from, to, tokenId) {
        Utils.assert(Utils.addressCheck(to), "ERC721: Transfer to the zero address");
        let previousOwner = self.p.update(to, tokenId, EMPTY_ADDRESS);
        Utils.assert(Utils.addressCheck(previousOwner), "ERC721: Transfer from nonexistent owner");
        Utils.assert(previousOwner !== from, "ERC721: Transfer to the caller");
    };

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking that contract recipients
     * are aware of the ERC-721 standard to prevent tokens from being forever locked.
     *
     * `data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is like {safeTransferFrom} in the sense that it invokes
     * {IERC721Receiver-onERC721Received} on the receiver, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `tokenId` token must exist and be owned by `from`.
     * - `to` cannot be the zero address.
     * - `from` cannot be the zero address.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    self.p.safeTransfer = function (from, to, tokenId, data = "") {
        _transfer(from, to, tokenId);
        /*
        if(data !== "") {
            // Implement checkOnERC721Received
        }
         */
    };

    self.balanceOf = function (paramObj) {
        Utils.assert(Utils.addressCheck(paramObj.owner), "ERC721: Invalid owner address: " + paramObj.owner);
        let balance = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(BALANCES_PRE, paramObj.owner));
        if (balance === false) {
            return '0';
        }
        return balance;
    };

    self.ownerOf = function (paramObj) {
        return _requiredOwned(paramObj.tokenId);
    };

    self.name = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data.name;
    };

    self.symbol = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data.symbol;
    };

    self.tokenURI = function (paramObj) {
        _requiredOwned(paramObj.tokenId);
        let _uri = self.p.baseURI();
        return _uri.length > 0 ? _uri + paramObj.tokenId : "";
    };

    self.approve = function (paramObj) {
        return self.p.approve(paramObj.to, paramObj.tokenId, Chain.msg.sender);
    };

    self.getApproved = function (paramObj) {
        _requiredOwned(paramObj.tokenId);
        return self.p.getApproved(paramObj.tokenId);
    };

    self.setApprovalForAll = function (paramObj) {
        return self.p.setApprovalForAll(Chain.msg.sender, paramObj.operator, paramObj.approved);
    };

    self.isApprovedForAll = function (paramObj) {
        return BasicOperationUtil.loadObj(BasicOperationUtil.getKey(OPERATOR_APPROVAL_PRE, paramObj.owner, paramObj.operator));
    };

    self.transferFrom = function (paramObj) {
        Utils.assert(Utils.addressCheck(paramObj.to), "ERC721: Invalid receiver address.");
        let previousOwner = self.p.update(paramObj.to, paramObj.tokenId, Chain.msg.sender);
        Utils.assert(previousOwner === paramObj.from, "ERC721: Incorrect owner");
    };

    self.safeTransferFrom = function (paramObj) {
        self.transferFrom(paramObj);
        /*
         if(paramObj.data !== "") {
             // Implement checkOnERC721Received
         }
          */
    };

    self.contractInfo = function () {
        return BasicOperationUtil.loadObj(CONTRACT_INFO);
    };

    self.p.init = function (name, symbol, describe = "", version = "1.0.0") {
        BasicOperationUtil.saveObj(CONTRACT_INFO, {
            name: name,
            symbol: symbol,
            describe: describe,
            protocol: ZTP_PROTOCOL,
            version: version,
            issuer: Chain.msg.sender
        });
    };
};
