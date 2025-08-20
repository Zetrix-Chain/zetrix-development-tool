/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol
 */

import 'utils/basic-operation'
import 'library/ztp1155/ztp1155';

const ZTP1155URIStorage = function () {

    const BasicOperationUtil = new BasicOperation();

    const TOKEN_URIS = 'token_uris';
    const BASE_URI = 'base_uri';

    const self = this;

    ZTP1155.call(self);

    // override
    const _uri = self.uri;
    self.uri = function (paramObj) {
        let tokenUri = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_URIS, paramObj.id));
        let baseUri = BasicOperationUtil.loadObj(BASE_URI);
        if (baseUri === false) {
            baseUri = '';
        }
        return (tokenUri !== false && tokenUri.length > 0) ? (baseUri + tokenUri) : _uri.call(self, paramObj);
    };

    self.setURI = function (id, tokenURI) {
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_URIS, id), tokenURI);
        Chain.tlog("URI", self.uri({id: id}), id);
    };

    self.setBaseURI = function (baseURI) {
        BasicOperationUtil.saveObj(BASE_URI, baseURI);
    };

};
