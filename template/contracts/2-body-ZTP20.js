
function makeAllowanceKey(owner, spender) {
  return 'allow_' + owner + '_to_' + spender;
}

function approve(spender, value) {

  let key = makeAllowanceKey(Chain.msg.sender, spender);
  Chain.store(key, value);

  Chain.tlog('Approve', Chain.msg.sender, spender, value);

  return true;
}

function allowance(owner, spender) {

  let key = makeAllowanceKey(owner, spender);
  let value = Chain.load(key);

  return value;
}

function transfer(to, value) {

  let senderValue = Chain.load(Chain.msg.sender);

  let toValue = Chain.load(to);
  toValue = (toValue === false) ? value: Utils.int64Add(toValue, value);
  Chain.store(to, toValue);

  senderValue = Utils.int64Sub(senderValue, value);
  Chain.store(Chain.msg.sender, senderValue);

  Chain.tlog('Transfer', Chain.msg.sender, to, value);

  return true;
}

function transferFrom(from, to, value) {

  let fromValue = Chain.load(from);
  let allowValue = allowance(from, Chain.msg.sender);
   let toValue = Chain.load(to);
  toValue = (toValue === false) ? value: Utils.int64Add(toValue, value);
  Chain.store(to, toValue);

  fromValue = Utils.int64Sub(fromValue, value);
  Chain.store(from, fromValue);

  let allowKey = makeAllowanceKey(from, Chain.msg.sender);
  allowValue = Utils.int64Sub(allowValue, value);
  Chain.store(allowKey, allowValue);

  Chain.tlog('Transfer', from, to, value);

  return true;
}

function deposit(value) {

  let senderValue = Chain.load(Chain.msg.sender);
  senderValue = (senderValue === false) ? value: Utils.int64Add(senderValue, value);
  Chain.store(Chain.msg.sender, senderValue);
  Chain.tlog('Deposit', Chain.msg.sender, value);
  Chain.tlog('Transfer', "0x", Chain.msg.sender, value);
  return true;
}

function withdrawal(value) {

  let senderValue = Chain.load(Chain.msg.sender);
  senderValue = Utils.int64Sub(senderValue, value);
  Chain.store(Chain.msg.sender, senderValue);

  Chain.tlog('Withdrawal', Chain.msg.sender, value);
  Chain.tlog('Transfer', Chain.msg.sender, "0x", value);

  Chain.payCoin(Chain.msg.sender, value);
  return true;
}

function balanceOf(address) {

  let value = Chain.load(address);
  return value === false ? "0": value;
}

function testMethod(address) {
  return "Test method address input: " + address;
}