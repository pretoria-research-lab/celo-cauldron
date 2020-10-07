import * as contractkit from "@celo/contractkit";
import axios from "axios";

export const getCurrentBlockNumber = async (nodeProvider) => {    
	const kit = contractkit.newKit(nodeProvider);
	const blockNumber = await kit.web3.eth.getBlockNumber();
	return blockNumber;
};

export const getCurrentEpochNumber = async (nodeProvider, currentBlockNumber) => {    
	const kit = contractkit.newKit(nodeProvider);
	const epochNumber = await kit.getEpochNumberOfBlock(currentBlockNumber);
	return epochNumber;
};

export const getValidatorGroups = async (nodeProvider) => {
	const kit = contractkit.newKit(nodeProvider);
	const election = await kit.contracts.getElection();
	const accounts = await kit.contracts.getAccounts();
	const validatorGroupsVotes = await election.getValidatorGroupsVotes();
	const groups = await Promise.all(
		validatorGroupsVotes.map((group) => {
		  return {
				"address": group.address,
				"metadata": accounts.getMetadataURL(group.address)
		  };
		}));
	return groups;
};

export const getMetadataURL = async (nodeProvider, account) => {
	const kit = contractkit.newKit(nodeProvider);
	const accounts = await kit.contracts.getAccounts();
	const metadataURL = await accounts.getMetadataURL(account);
	return metadataURL;
};

export const getAttestationURL = async (nodeProvider, account) => {
	
	let metadataURL = await getMetadataURL(nodeProvider, account);
	metadataURL = "https://cors-anywhere.herokuapp.com/"+metadataURL;
	const urlParts = metadataURL.replace('http://','').replace('https://','').split(/[/?#]/);
	const host = urlParts[0];
	const TIMEOUT = 10000;
	const HEADERS = {"Content-Type":"application/json;charset=utf-8"};
	const instance = axios.create({
			baseUrl: host,
			timeout: TIMEOUT,
			headers: HEADERS
		});
	const metadata = await instance.get(metadataURL);
	const claims = metadata.data.claims;
	const attestationServiceURL = claims.filter((element, index) => {return element.type==="ATTESTATION_SERVICE_URL";})[0];

	return attestationServiceURL.url;
};

export const getAttestationHealthz = async (attestationServiceURL) => {
	
	const url = "https://cors-anywhere.herokuapp.com/"+attestationServiceURL;
	const urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
	const host = urlParts[0];
	const TIMEOUT = 10000;
	const HEADERS = {"Content-Type":"application/json;charset=utf-8"};
	const instance = axios.create({
			baseUrl: host,
			timeout: TIMEOUT,
			headers: HEADERS
		});
	const healthz = await instance.get(url + "/healthz");
	const status = healthz.data.status;
	return status;
};

export const getAttestationStatus = async (attestationServiceURL) => {
	
	const url = "https://cors-anywhere.herokuapp.com/"+attestationServiceURL;
	const urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
	const host = urlParts[0];
	const TIMEOUT = 10000;
	const HEADERS = {"Content-Type":"application/json;charset=utf-8"};
	const instance = axios.create({
			baseUrl: host,
			timeout: TIMEOUT,
			headers: HEADERS
		});
	const status = await instance.get(url + "/status");
	return status.data;
};