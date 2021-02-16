import { strict as assert } from "assert";
import {API_CONFIG} from "../Utils/config";
import * as contractkit from "@celo/contractkit";

const mainnetForno = API_CONFIG.filter((element) => element.network === "mainnet")[0].remoteNode;
const timeOut = 40000;

test("contractkit", async () => { 
	const kit = contractkit.newKit(mainnetForno);
	const blockNumber = await kit.web3.eth.getBlockNumber();
	console.log("Current blockNumber is " + blockNumber);
	assert(blockNumber);
	assert.notEqual(blockNumber, 0);    
}, timeOut);

test("create account from private key", async () => {  

	const kit = contractkit.newKit(mainnetForno);

	// Add account with private key 0000000000000000000000000000000000000000000000000000000000000001
	/*eslint no-undef: "warn"*/
	var privateKey = Buffer.alloc(32, 0);
	privateKey[31] = 1;
	console.log("PK::" + privateKey.toString("hex"));
	kit.addAccount(privateKey.toString("hex"));

	// Add account with private key 0000000000000000000000000000000000000000000000000000000000000002      
	/*eslint no-undef: "warn"*/	
	privateKey = Buffer.alloc(32, 0);
	privateKey[31] = 2;
	console.log("PK::" + privateKey.toString("hex"));
	kit.addAccount(privateKey.toString("hex"));

	// Get accounts
	const accounts = await kit.web3.eth.getAccounts();
	console.log(accounts);
	assert.equal(accounts.length, 2);

	// Check individual accounts
	assert.equal(accounts[0], "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf", "accounts[0] should be 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf");
	assert.equal(accounts[1], "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF", "accounts[1] should be 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF");

	console.log(accounts[0]);
	console.log(accounts[1]);

	// Set default account
	kit.defaultAccount = accounts[0];
	assert.equal(accounts[0], kit.defaultAccount);

}, timeOut);