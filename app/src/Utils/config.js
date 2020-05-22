export const API_CONFIG = [
	{   network : "alfajores",
		host: "https://cuzea5un8e.execute-api.eu-central-1.amazonaws.com",
		basePath: "/alfajores",
		blockExplorer: "https://alfajores-blockscout.celo-testnet.org/",
		faucetAddress: "0xC02b8b165CC5a2A731E9C2BD6fdF66eaBcfa8663",
		remoteNode: "https://alfajores-forno.celo-testnet.org",
		blocksCooldown: 12
	},
	{   network : "baklava",
		host: "https://zk7t7un2v2.execute-api.eu-central-1.amazonaws.com",
		basePath: "/baklava",
		blockExplorer: "https://baklava-blockscout.celo-testnet.org/",
		faucetAddress: "0xC02b8b165CC5a2A731E9C2BD6fdF66eaBcfa8663",
		remoteNode: "https://baklava-forno.celo-testnet.org",
		blocksCooldown: 12
	},
	{   network : "mainnet",
		host: "https://cuzea5un8e.execute-api.eu-central-1.amazonaws.com",
		basePath: "/rc1",
		remoteNode: "https://rc1-forno.celo-testnet.org/",
		blockExplorer: "https://explorer.celo.org/",
		blocksCooldown: 12
	}
];

export const SIGNED_BLOCKS_API_CONFIG = [
	{   network : "mainnet",
		host: "https://394txl34uf.execute-api.eu-central-1.amazonaws.com",
		basePath: "/mainnet",
		firstBlock: 3200,
		paginationListLength: 12
	},
	{   network : "baklava",
		host: "https://tqgd1io8a4.execute-api.eu-central-1.amazonaws.com",
		basePath: "/baklava",
		firstBlock: 1000,
		paginationListLength: 12
	}
];

export const GA_TAG = "UA-165916679-1";
export const validatorGroupLink = "https://explorer.celo.org/address/0xddaa60b6d803674bbc434f1c2b261ceb67c2fd7c/celo";
export const validatorGroup = "0xddaa60b6d803674bbc434f1c2b261ceb67c2fd7c";