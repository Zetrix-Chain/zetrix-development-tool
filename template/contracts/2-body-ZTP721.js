//ZTP 721 body ************************************************************************//

function getKey(first, second, third = '') {
  return (third === '') ? (first + '_' + second) : (first + '_' + second + '_' + third);
}

function loadObj(key) {
  let data = Chain.load(key);
  return JSON.parse(data);
}

function saveObj(key, value) {
  Chain.store(key, JSON.stringify(value));
}

function checkAssetExsit(id) {
  let data = Chain.load(getKey(ASSET_PRE, id));
  if (data === false) {
    return false;
  }

  return true;
}

function saveAsset(id, issuer, uri) {
  let nftObj = {};
  nftObj.id = id;
  nftObj.issuer = issuer;
  nftObj.uri = uri;
  saveObj(getKey(ASSET_PRE, id), nftObj);
}

function getAssetOwner(id) {
  let data = Chain.load(getKey(ASSET_OWNER_PRE, id));
  if (data === false) {
    return '';
  }

  return JSON.parse(data).owner;
}

function saveAssetOwner(id, owner) {
  let obj = {};
  obj.owner = owner;
  saveObj(getKey(ASSET_OWNER_PRE, id), obj);
}

function getAssetUserCount(user) {
  let data = Chain.load(getKey(ASSET_USER_COUNT_PRE, user));
  if (data === false) {
    return '0';
  }

  return JSON.parse(data).count;
}

function saveAssetUserCount(user, count) {
  let key = getKey(ASSET_USER_COUNT_PRE, user);
  if (Utils.int64Compare(count, '0') !== 0) {
    let obj = {};
    obj.count = count;
    saveObj(key, obj);
    return;
  }

  let data = Chain.load(key);
  if (data !== false) {
    Chain.del(key);
  }
}

function getApproveSingle(id) {
  let data = Chain.load(getKey(APPROVE_SINGLE_PRE, id));
  if (data === false) {
    return '';
  }

  return JSON.parse(data).operator;
}

function saveApproveSingle(id, operator) {
  let obj = {};
  obj.operator = operator;
  saveObj(getKey(APPROVE_SINGLE_PRE, id), obj);
}

function delApproveSingle(id) {
  let key = getKey(APPROVE_SINGLE_PRE, id);
  let data = Chain.load(key);
  if (data === false) {
    return false;
  }
  Chain.del(key);
  return true;
}

function getApproveAll(owner, operator) {
  let data = Chain.load(getKey(APPROVE_ALL_PRE, owner, operator));
  if (data === false) {
    return false;
  }

  return JSON.parse(data).approved;
}

function saveApproveAll(owner, operator, approved) {
  let key = getKey(APPROVE_ALL_PRE, owner, operator);
  if (approved) {
    let approvedObj = {};
    approvedObj.approved = approved;
    saveObj(key, approvedObj);
    return;
  }

  let data = Chain.load(key);
  if (data !== false) {
    Chain.del(key);
  }
}

function getAssetSupply() {
  let data = Chain.load(ASSET_SUPPLY);
  if (data === false) {
    return '0';
  }

  return JSON.parse(data).count;
}

function saveAssetSupply(count) {
  let supplyObj = {};
  supplyObj.count = count;
  saveObj(ASSET_SUPPLY, supplyObj);
}

function _approve(owner, id, approved) {
  if (approved !== '') {
    saveApproveSingle(id, approved);
    Chain.tlog('Approval', owner, approved, id);
    return;
  }

  if (delApproveSingle(id)) {
    Chain.tlog('Approval', owner, '0x', id);
    return;
  }
}

function _transFrom(id, from, to) {

  let owner = getAssetOwner(id);

  saveAssetUserCount(from, Utils.int64Sub(getAssetUserCount(from), '1'));
  saveAssetUserCount(to, Utils.int64Add(getAssetUserCount(to), '1'));

  saveAssetOwner(id, to);

  _approve(owner, id, '');

  Chain.tlog('Transfer', owner, to, id);

  return;
}

function safeTransferFrom(paramObj) {

  _transFrom(paramObj.id, paramObj.from, paramObj.to);
  return;
}

function transferFrom(paramObj) {

  _transFrom(paramObj.id, paramObj.from, paramObj.to);
  return;
}

function approve(paramObj) {

  let owner = getAssetOwner(paramObj.id);

  _approve(owner, paramObj.id, paramObj.approved);
  return;
}

function setApprovalForAll(paramObj) {

  saveApproveAll(Chain.msg.sender, paramObj.operator, paramObj.approved);

  Chain.tlog('ApprovalForAll', Chain.msg.sender, paramObj.operator, paramObj.approved);
  return;
}

function mint(paramObj) {

  let newId = Utils.int64Add(getAssetSupply(), '1');
  let newUserCount = Utils.int64Add(getAssetUserCount(paramObj.to), '1');
  saveAsset(newId, Chain.msg.sender, paramObj.uri);
  saveAssetOwner(newId, paramObj.to);
  saveAssetUserCount(paramObj.to, newUserCount);
  saveAssetSupply(newId);

  Chain.tlog('Transfer', '0x', paramObj.to, newId);
  return;
}

function burn(paramObj) {

  let owner = getAssetOwner(paramObj.id);

  saveAssetUserCount(owner, Utils.int64Sub(getAssetUserCount(owner), '1'));

  saveAssetOwner(paramObj.id, '');

  _approve(owner, paramObj.id, '');

  Chain.tlog('Transfer', owner, '0x', paramObj.id);
  return;
}

function balanceOf(paramObj) {


  let result = {};
  result.count = getAssetUserCount(paramObj.owner);
  return result;
}

function ownerOf(paramObj) {

  let result = {};
  result.address = getAssetOwner(paramObj.id);
  return result;
}

function getApproved(paramObj) {

  let result = {};
  result.address = getApproveSingle(paramObj.id);
  return result;
}

function isApprovedForAll(paramObj) {

  let result = {};
  result.approved = getApproveAll(paramObj.owner, paramObj.operator);
  return result;
}

function contractInfo() {
  return loadObj(CONTRACT_PRE);
}

function tokenURI(paramObj) {
 
  let result = {};
  result.uri = loadObj(getKey(ASSET_PRE, paramObj.id)).uri;
  return result;
}

function totalSupply(paramObj) {
  let result = {};
  result.count = getAssetSupply();
  return result;
}