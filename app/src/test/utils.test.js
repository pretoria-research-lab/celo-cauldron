var assert = require("assert");
var utils = require("../Utils/utils");
var fornoTimeout = 20000; //ms

test("Baklava - getValidatorGroups()", async () => {
	const result = await utils.getValidatorGroups("https://baklava-forno.celo-testnet.org");
	console.log(JSON.stringify(result));
	assert(result.length > 0);
}, fornoTimeout); 

test("Baklava - getCurrentBlockNumber()", async () => {    
	const result = await utils.getCurrentBlockNumber("https://baklava-forno.celo-testnet.org");
	assert(result > 0);
});

// test("Alfajores - getValidatorGroups()", async () => {
// 	const result = await utils.getValidatorGroups("https://alfajores-forno.celo-testnet.org");
// 	assert(result.length > 0);
// }, fornoTimeout); 

// test("Alfajores - getCurrentBlockNumber()", async () => {    
// 	const result = await utils.getCurrentBlockNumber("https://alfajores-forno.celo-testnet.org");
// 	assert(result > 0);
// });

