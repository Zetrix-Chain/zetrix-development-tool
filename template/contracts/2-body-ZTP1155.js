// ZTP1155 body *********************************************************************//

function _isHexStr64(str) {
  let a = /^[A-Fa-f0-9]{64,64}$/;
  return a.test(str);
}

function getKey(first, second, third = '') {
  return (third === '') ? (first + '_' + second) : (first + '_' + second + '_' + third);
}

function _isCreator(address, ID) {
  return ID.substr(0, 32) === Utils.sha256(address, 1).substr(0, 32);
}

function _maxSupply(ID) {
  let result = Utils.hexToDec(ID.substr(48, 16));
  return Utils.int64Add(result, "0");
}

function loadObj(key) {
  let data = Chain.load(key);
  return JSON.parse(data);
}

function saveObj(key, value) {
  Chain.store(key, JSON.stringify(value));
}

function getBalance(id, owner) {
  let data = Chain.load(getKey(BALANCE_PRE, id, owner));
  if (data === false) {
    return "0";
  }

  return JSON.parse(data).value;
}

function saveBalance(id, owner, value) {
  let result = Utils.int64Compare(value, "0");
  Utils.assert(value >= 0, 'Value must gt or equal 0.');
  if (result === 0) {
    Chain.del(getKey(BALANCE_PRE, id, owner));
    return;
  }

  let balanceObj = {};
  balanceObj.value = value;
  saveObj(getKey(BALANCE_PRE, id, owner), balanceObj);
}

function getApproved(owner, operator) {
  let data = Chain.load(getKey(APPROVE_PRE, owner, operator));
  if (data === false) {
    return false;
  }

  return JSON.parse(data).approved;
}

function saveApproved(owner, operator, approved) {
  let approvedObj = {};
  approvedObj.approved = approved;
  saveObj(getKey(APPROVE_PRE, owner, operator), approvedObj);
}

function saveAsset(id, issuer, uri, value, freezed) {
  let nftObj = {};
  nftObj.id = id;
  nftObj.issuer = issuer;
  nftObj.uri = uri;
  nftObj.value = value;
  nftObj.freezed = freezed;
  saveObj(getKey(ASSET_PRE, id), nftObj);
}

function getAsset(id) {
  return loadObj(getKey(ASSET_PRE, id));
}

function checkAssetExsit(id) {
  let data = Chain.load(getKey(ASSET_PRE, id));
  if (data === false) {
    return false;
  }

  return true;
}

function _mint(id, to, uri, value) {

  saveAsset(id, to, uri, value, false);
  saveBalance(id, to, value);
}

function _transFrom(id, from, to, value, data) {
  //If it doesn't exist, make lazy casting
  if (checkAssetExsit(id) === false) {
    _mint(id, from, data, _maxSupply(id));
  }

  let approved = getApproved(from, Chain.msg.sender);

  let rawFromValue = getBalance(id, from);
  let rawToValue = getBalance(id, to);

  let fromValue = Utils.int64Sub(rawFromValue, value);
  let toValue = Utils.int64Add(rawToValue, value);
  //Check if your assets are owned or approved
  saveBalance(id, to, toValue);
  saveBalance(id, from, fromValue);

  //TODOO triggers contract execution if it is a contract
}

function safeTransferFrom(paramObj) {
  //Checking parameter Validity
  _transFrom(paramObj.id, paramObj.from, paramObj.to, paramObj.value, paramObj.data);

  //trigger event
  Chain.tlog('TransferSingle', Chain.msg.sender, paramObj.from, paramObj.to, paramObj.id, paramObj.value);
}

function safeBatchTransferFrom(paramObj) {

  //Transfer assets and keep records
  let i = 0;
  for (i = 0; i < paramObj.ids.length; i += 1) {
    Utils.assert(Utils.int64Compare(paramObj.values[i], 0) > 0, 'Value must greater than 0.');
    _transFrom(paramObj.ids[i], paramObj.from, paramObj.to, paramObj.values[i], paramObj.datas[i]);
  }

  //trigger event
  Chain.tlog('TransferBatch', Chain.msg.sender, paramObj.from, paramObj.to, JSON.stringify(paramObj.ids), JSON.stringify(paramObj.values));
}

function setApprovalForAll(paramObj) {

  //state of preservation
  saveApproved(Chain.msg.sender, paramObj.operator, paramObj.approved);

  //Trigger log
  Chain.tlog('ApprovalForAll', Chain.msg.sender, paramObj.operator, paramObj.approved);
}

function setURI(paramObj) {

  let asset = getAsset(paramObj.id);
  saveAsset(asset.id, asset.issuer, paramObj.uri, asset.value, paramObj.freezed);
  Chain.tlog('URI', paramObj.uri, paramObj.id);
  if (paramObj.freezed === true) {
    Chain.tlog('Freezed', paramObj.uri, paramObj.id);
  }

  return;
}

function mint(paramObj) {
 //Issue additional assets and keep records
  _mint(paramObj.id, paramObj.to, paramObj.uri, paramObj.value);

  //trigger event
  Chain.tlog('TransferSingle', Chain.msg.sender, '0x', paramObj.to, paramObj.id, paramObj.value);
}

function _burn(id, from, value) {

  //Check whether you approve or own assets
  let approved = getApproved(from, Chain.msg.sender);

  let rawFromValue = getBalance(id, from);


  let fromValue = Utils.int64Sub(rawFromValue, value);
  //Transfer assets and keep records
  saveBalance(id, from, fromValue);
}

function burn(paramObj) {


  //Destruction of assets
  _burn(paramObj.id, paramObj.from, paramObj.value);

  //trigger event
  Chain.tlog('TransferSingle', Chain.msg.sender, paramObj.from, '0x', paramObj.id, paramObj.value);
}

function balanceOf(paramObj) {

  let result = {};
  result.balance = getBalance(paramObj.id, paramObj.owner);
  return result;
}

function balanceOfBatch(paramObj) {

  let result = {};
  result.balances = [];
  let i = 0;
  for (i = 0; i < paramObj.ids.length; i += 1) {
    result.balances.push(getBalance(paramObj.ids[i], paramObj.owners[i]));
  }

  return result;
}

function isApprovedForAll(paramObj) {
 
  let approvedObj = {};
  approvedObj.approved = getApproved(paramObj.owner, paramObj.operator);
  return approvedObj;
}

function contractInfo() {
  return loadObj(CONTRACT_PRE);
}

function uri(paramObj) {

  let uriObj = {};
  uriObj.uri = getAsset(paramObj.id).uri;
  return uriObj;
}

function freezed(paramObj) {
 
  let freezedObj = {};
  freezedObj.freezed = getAsset(paramObj.id).freezed;
  return freezedObj;
}