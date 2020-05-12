const assert = require("assert");
const utils = require("../Utils/utils");
const fornoTimeout = 40000; //ms
const config = require('../Utils/config');

const baklavaForno = config.API_CONFIG.filter((element) => element.network === 'baklava')[0].remoteNode;
const alfajoresForno = config.API_CONFIG.filter((element) => element.network === 'alfajores')[0].remoteNode;
const rc1Forno = config.API_CONFIG.filter((element) => element.network === 'rc1')[0].remoteNode;

test("Alfajores - getValidatorGroups()", async () => {
	const result = await utils.getValidatorGroups(alfajoresForno);
	assert(result.length > 0);
}, fornoTimeout); 

test("Alfajores - getCurrentBlockNumber()", async () => {    
	const result = await utils.getCurrentBlockNumber(alfajoresForno);
	assert(result > 0);
}, fornoTimeout);

test("Baklava - getValidatorGroups()", async () => {
	const result = await utils.getValidatorGroups(baklavaForno);
	console.log(JSON.stringify(result));
	assert(result.length > 0);
}, fornoTimeout); 

test("Baklava - getCurrentBlockNumber()", async () => {    
	const result = await utils.getCurrentBlockNumber(baklavaForno);
	assert(result > 0);
});

test("RC1 - getValidatorGroups()", async () => {
	const result = await utils.getValidatorGroups(rc1Forno);
	console.log(JSON.stringify(result));
	assert(result.length > 0);
}, fornoTimeout); 

test("RC1 - getCurrentBlockNumber()", async () => {    
	const result = await utils.getCurrentBlockNumber(rc1Forno);
	assert(result > 0);
});

