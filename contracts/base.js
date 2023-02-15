"use strict";

function init(bar) {
  /*init whatever you want*/
  return;
}

function main(input_str) {
  let input = JSON.parse(input_str);
  let params = input.params;
  if (input.method === 'testMethod') {
    let x = {
      'hello': params.name
    };
  } else {
    throw 'Unknown operating: ' + input.method + '.';
  }
}

function query(input_str) {
  let input = JSON.parse(input_str);

  let result = {};
  if (input.method === 'getTestObject') {
    result.testResult = 'Working fine';
  } else {
    throw 'Unknown operating: ' + input.method + '.';
  }

  return JSON.stringify(result);
}
