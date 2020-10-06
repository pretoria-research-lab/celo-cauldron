const assert = require("assert");
const utils = require("../Utils/utils");
const fornoTimeout = 60000; //ms
const config = require("../Utils/config");

const baklavaForno = config.API_CONFIG.filter((element) => element.network === "baklava")[0].remoteNode;
const alfajoresForno = config.API_CONFIG.filter((element) => element.network === "alfajores")[0].remoteNode;
const mainnetForno = config.API_CONFIG.filter((element) => element.network === "mainnet")[0].remoteNode;

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
}, fornoTimeout);

test("Mainnet - getValidatorGroups()", async () => {
	const result = await utils.getValidatorGroups(mainnetForno);
	console.log(JSON.stringify(result));
	assert(result.length > 0);
}, fornoTimeout); 

test("Mainnet - getCurrentBlockNumber()", async () => {    
	const result = await utils.getCurrentBlockNumber(mainnetForno);
	assert(result > 0);
}, fornoTimeout);

test("Mainnet - getMetadataURL())", async () => {    
	const result = await utils.getMetadataURL(mainnetForno, "0xe4036C56B0026eb86f058c77c55E73e9d65d2EA0");
	console.log(result);
	assert(result);
}, fornoTimeout);

test("Mainnet - getAttestationURL())", async () => {    
	const result = await utils.getAttestationURL(mainnetForno, "0xe4036C56B0026eb86f058c77c55E73e9d65d2EA0");
	console.log(result);
	assert(result);
}, fornoTimeout);

// test("Mainnet - getAttestationStatus())", async () => {    
// 	const result = await utils.getAttestationStatus(mainnetForno, "0xe4036C56B0026eb86f058c77c55E73e9d65d2EA0");
// 	console.log(result);
// 	assert(result);
// }, fornoTimeout);