import axios from "axios";
export default class AttestationService {

	TIMEOUT = 29000;
	HEADERS = {"Content-Type":"application/json;charset=utf-8"};
	PARSED_PATH = "/parsed";
	FULL_PATH = "/full";

	createInstance = (config) => {
		return axios.create({
			baseUrl: config.host,
			timeout: this.TIMEOUT,
			headers: this.HEADERS
		});
	}

	getFullAttestations = async (config) => {
		const instance = this.createInstance(config);
		const response = await instance.get(config.host + config.basePath + this.FULL_PATH);
		console.log("AttestationService - getFullAttestations() - success");
		return response;
	}

	getParsedAttestations = async (config) => {
		const instance = this.createInstance(config);
		const response = await instance.get(config.host + config.basePath + this.PARSED_PATH);
		console.log("AttestationService - getParsedAttestations() - success");
		return response;
    }
}