import axios from "axios";
export default class AttestationService {

	TIMEOUT = 29000;
	HEADERS = {"Content-Type":"application/json;charset=utf-8", "Accept":"*/*"};
	PARSED_PATH = "/parsed";
	FULL_PATH = "/full";
	ATTESTATION_PATH = "/attestation";

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

	getAttestationStatus = async (config, metadataURL) => {
		const instance = this.createInstance(config);
		const response = await instance.get(config.host + config.basePath + this.ATTESTATION_PATH + "?metadataURL=" + metadataURL);
		console.log("AttestationService - getAttestationStatus() - success");
		return response;		
	}

	getAttestationStatusProxied = async (config, metadataURL) => {
		const CORS_ANYWHERE="https://shielded-ravine-99376.herokuapp.com/";
		const proxiedMetadataURL = CORS_ANYWHERE+metadataURL;
		const instance = this.createInstance(config);
		const response = await instance.get(config.host + config.basePath + this.ATTESTATION_PATH + "?metadataURL=" + proxiedMetadataURL);
		console.log("AttestationService - getAttestationStatusProxied() - success");
		return response;		
	}

}