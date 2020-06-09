import React, {Component} from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import * as toast from "../Common/Notification";
import "./faucet.css";
import {API_CONFIG} from "../Utils/config";
import {getCurrentBlockNumber} from "../Utils/utils";
import FaucetService from "../FaucetService";
import FaucetQueueTable from "./FaucetQueueTable";
import FaucetHeader from "./FaucetHeader";
import FaucetInformation from "./FaucetInformation";

const faucetService = new FaucetService();
const refreshBlockNumberMillis = 5000;

class Faucet extends Component 
{

	static get propTypes() { 
		return { 
			network: PropTypes.any
		}; 
	}

	constructor(props){
		super(props);
		this.state = {faucetRequests: [], loading: true, faucetBalance: 0, config: {}, blockNumber: -1, processing: false};
	}

	getBlockNumber = async () => {
		try{
			const nodeProvider = this.state.config.remoteNode;
			const blockNumber = await getCurrentBlockNumber(nodeProvider);
			this.setState({blockNumber: blockNumber});
		}catch(error){
			toast.notify("ERROR", this.props.network + " is not responding");
			this.setState({blockNumber: -1});
		}
	}

	getConfig = (network) => {
		const config = API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
		console.log(`Using configuration - ${JSON.stringify(config)}`);
		return config;
	}

	componentDidMount = () => {
		this.setState({config: this.getConfig(this.props.network)}, () => {
			const blockNumberIntervalID = setInterval(this.getBlockNumber, refreshBlockNumberMillis);
			this.setState({blockNumberIntervalID:blockNumberIntervalID}, () => this.getAllRequests());
		});        
	}

	componentWillUnmount = () => {
		clearInterval(this.state.blockNumberIntervalID);
	}

	sortByRequestedBlock = (flip) => {
		const requests = this.state.faucetRequests;
		requests.sort((x, y) => {
			let a = x.createdBlockNumber, b = y.createdBlockNumber;
			if(flip){a = y.createdBlockNumber; b = x.createdBlockNumber;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({faucetRequests: requests});
	}	

	claimRequest = (faucetRequest) => {
		this.setState({loading:true}, async () => 
		{
			try{
				const response = await faucetService.claimRequest(this.state.config, faucetRequest.address);
				const claimResult = response.data.claimResult;
				console.log(claimResult);
				toast.notify("INFO", "Faucet request completed");
				this.getAllRequests();
				this.setState({loading:false});        
			}
			catch (error) {
				toast.processError(error);
				this.setState({loading:false});
			}
		});
	}

	createRequest = (address) => {
		this.setState({loading:true}, async () => 
		{
			try{
				const response = await faucetService.createRequest(this.state.config, address);
				const createResult = response.data;
				console.log(createResult);
				this.getAllRequests();
				this.setState({loading:false});
				toast.notify("INFO", "Requested");
			}
			catch (error) {
				toast.processError(error);
				this.setState({loading:false});
			}
		});
	}

	getAllRequests = () => {   
		this.setState({loading:true}, async () => {
			try{
				console.log(this.state);
				const response = await faucetService.getAllRequests(this.state.config);
				const faucetRequests = response.data.faucetRequests;
				const faucetBalance = response.data.faucetBalance;
				faucetRequests.forEach(element => {
					element["addressLink"] = this.state.config.blockExplorer + "address/" + element.address;
					element["txLink"] = this.state.config.blockExplorer + "tx/" + element.txId;
				});
				this.setState({faucetRequests}, 
					() => this.setState({faucetBalance},
						() => 	{	this.sortByRequestedBlock(true); 
							this.setState({loading:false});
						}));

				toast.notify("INFO", "Refreshed faucet requests");
			}
			catch (error) {
				toast.notify("WARN","Error retrieving faucet requests, please refresh");
				const faucetRequests = [];
				this.setState({faucetRequests}, () => this.setState({loading:true}));
			}
		});
	} 

	render = () => {
		return ( 
			<div className="container-fluid faucet-content">        
				<FaucetHeader config={this.state.config} network={this.props.network}/>
				<FaucetInformation config={this.state.config} blockNumber={this.state.blockNumber} network={this.props.network} faucetBalance={this.state.faucetBalance}/>
				<FaucetQueueTable config={this.state.config} loading={this.state.loading} blockNumber={this.state.blockNumber} faucetRequests={this.state.faucetRequests} claimRequest={this.claimRequest} createRequest={this.createRequest}/>
				<ToastContainer autoClose={toast.DEFAULT_AUTOCLOSE}/>
				<hr />
			</div>
		);
	}  
}

export default Faucet;