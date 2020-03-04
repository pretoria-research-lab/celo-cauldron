import axios from 'axios';

const TIMEOUT = 10000;
const HEADERS = {"Content-Type":"application/json;charset=utf-8"};
const REQUEST_PATH = "/request";
const CLAIM_PATH = "/claim";

export default class FaucetService {

  createInstance = (config) => {
    return axios.create({
      baseUrl: config.host,
      timeout: TIMEOUT,
      headers: HEADERS
    });
  }

  getAllRequests = async (config) => {
    const instance = this.createInstance(config);
    const response = await instance.get(config.host + config.basePath + REQUEST_PATH);
    console.log("FaucetService - getAllRequests() - success, response : " + JSON.stringify(response));
    return response;
  }  

  createRequest = async (config, address) => {
    const instance = this.createInstance(config);
    const response = await instance.post(config.host + config.basePath + REQUEST_PATH, {address: address});
    console.log("FaucetService - createRequest() - success, response : " + JSON.stringify(response));
    return response;
  }

  claimRequest = async (config, address) => {
    const instance = this.createInstance(config);
    const response = await instance.post(config.host + config.basePath + CLAIM_PATH, {address: address});
    console.log("FaucetService - claimRequest() - success, response : " + JSON.stringify(response));
    return response;
  }
}