import * as contractkit from "@celo/contractkit";

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