
// ZTP 20 init *************************************************************//
function init(input_str) {
  
    let paramObj = JSON.parse(input_str).params;
  
    paramObj.decimals = FIXED_DECIMALS;
    paramObj.protocol = PROTOCOL;
    Chain.store(CONTRACT_PRE, JSON.stringify(paramObj));
  }
  
  function main(input_str) {
    let input = JSON.parse(input_str);
  
    if (input.method === 'transfer') {
      transfer(input.params.to, input.params.value);
    } else if (input.method === 'transferFrom') {
      transferFrom(input.params.from, input.params.to, input.params.value);
    } else if (input.method === 'approve') {
      approve(input.params.spender, input.params.value);
    } else if (input.method === 'deposit') {
      deposit(input.params.value);
    } else if (input.method === 'withdrawal') {
      withdrawal(input.params.value);
    } else if (input.method === `testMethod`) {
      testMethod(input.params.address);
    } else {
      throw '';
    }
  }
  
  function query(input_str) {
    let result = {};
    let input = JSON.parse(input_str);
  
    if (input.method === 'contractInfo') {
      result = JSON.parse(Chain.load(CONTRACT_PRE));
      result.supply = Chain.getBalance(Chain.thisAddress);
    } else if (input.method === 'allowance') {
      result.allowance = allowance(input.params.owner, input.params.spender);
    } else if (input.method === 'balanceOf') {
      result.balance = balanceOf(input.params.address);
    } else {
      throw '';
    }
    return JSON.stringify(result);
  }

  //*******************************************************/

  // ZTP721@1155 init //

  // function init() {
  //   let paramObj;
  //   paramObj.name = "Global NFT";
  //   paramObj.symbol = "GCN";
  //   paramObj.describe = "Global coin token issued by XYZ";
  //   paramObj.version = "1";
  //   paramObj.protocol = "ztp721"; // To define that this contract is ZTP-721/1155 standards
  
  
  //   Chain.store("contract_info", JSON.stringify(paramObj));
  // }

  // function main(input_str) {
  //   let funcList = {
  //     'safeTransferFrom': safeTransferFrom,
  //     'safeBatchTransferFrom': safeBatchTransferFrom,
  //     'setApprovalForAll': setApprovalForAll,
  //     'setURI': setURI,                        // ZTP721
  //     'approve': approve,                      // ZTP721
  //     'setApprovalForAll': setApprovalForAll,
  //     'mint': mint,
  //     'burn': burn
  //   };
  //   let inputObj = JSON.parse(input_str);
  //   Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
  //   funcList[inputObj.method](inputObj.params);
  // }
  
  // function query(input_str) {
  //   let funcList = {
  //     'balanceOf': balanceOf,
  //     'balanceOfBatch': balanceOfBatch,
  //     'isApprovedForAll': isApprovedForAll,
  //     'contractInfo': contractInfo,
  //     'uri': uri,
  //     'freezed': freezed
  //   };
  //   let inputObj = JSON.parse(input_str);
  //   Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
  //   return JSON.stringify(funcList[inputObj.method](inputObj.params));
  
  // }


  