import axios from "axios";

export default class SignedBlocksService {

	TIMEOUT = 29000;
	HEADERS = {"Content-Type":"application/json;charset=utf-8"};
	REQUEST_PATH = "/signed-blocks";

	createInstance = (config) => {
		return axios.create({
			baseUrl: config.host,
			timeout: this.TIMEOUT,
			headers: this.HEADERS
		});
	}

	getAllSignatures = async (config) => {
		const instance = this.createInstance(config);
		const response = await instance.get(config.host + config.basePath + this.REQUEST_PATH);
		console.log("SignedBlocksService - getAllSignatures() - success");
		return response;
	}

	getSingle = async (config, atBlock, lookback) => {
		const instance = this.createInstance(config);
		const queryString = config.host + config.basePath + this.REQUEST_PATH + "?atBlock=" + atBlock + "&lookback=" + lookback;
		console.log("Calling SignedBlocksService with " + queryString);
		const response = await instance.get(queryString);
		console.log("SignedBlocksService - getSingle() - success");
		return response;
	}
}