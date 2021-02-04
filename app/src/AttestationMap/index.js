import React, {Component} from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import * as toast from "../Common/Notification";
import "../SignedBlocks/signed-blocks.css";
import "./attestation-map.css";
import {ATTESTATIONS_API_CONFIG, API_CONFIG} from "../Utils/config";
import {getCurrentBlockNumber, getCurrentEpochNumber, getMetadataURL, getAttestationURL, getAttestationStatus, getAttestationHealthz} from "../Utils/utils";
import AttestationService from "../AttestationService";
import AttestationMapTable from "./AttestationMapTable";
import AttestationMapHeader from "./AttestationMapHeader";
import ascendingIcon from "../assets/sort-down.svg";
import descendingIcon from "../assets/sort-up.svg";

const attestationAPI = new AttestationService();
const refreshBlockNumberMillis = 1000;
const refreshAttestationsMillis = 120000;

class AttestationMap extends Component 
{

	static get propTypes() { 
		return { 
			network: PropTypes.any,
			lookback: PropTypes.any
		}; 
	}

	constructor(props){
		super(props);

		const autoRefresh = localStorage.getItem(`attestation-autoRefresh-${this.props.network}`) === "true" ? true : false;
		const onlyFavourites = localStorage.getItem(`attestation-onlyFavourites-${this.props.network}`) === "true" ? true : false;
		let scale = parseInt(localStorage.getItem(`attestation-scale-${this.props.network}`)) || this.props.lookback;
		// If using old scale, update to the new scale default
		if([250,300,350].filter((x, index) => {return scale===x}).length === 0){
			scale = 250;
		}
		console.log(`Retrieved previous settings, autoRefresh ${autoRefresh}, scale ${scale}, onlyFavourites ${onlyFavourites}`);

		this.state =	
        {
        	lookback: scale, 
        	atBlock: -1, 
        	attestations: [], 
        	loading: true, 
        	attestationAPIConfig: {}, 
        	remoteNodeConfig: {}, 
        	blockNumber: 0, 
        	processing: false,
        	autoRefresh: autoRefresh,
        	epoch: -1,
        	onlyFavourites: onlyFavourites,
			errorMutex: false,
			sortIcon: descendingIcon,
			sortByAttributeName: "selectedCount",
			sortDirection: "descending"
        };
	}

	getCurrentBlockNumber = async () => {
		try{
			const nodeProvider = this.state.remoteNodeConfig.remoteNode;
			const blockNumber = await getCurrentBlockNumber(nodeProvider);
			const epochNumber = await getCurrentEpochNumber(nodeProvider, blockNumber);
			this.setState({blockNumber: blockNumber}, () => this.setState({epochNumber: epochNumber}));
		}catch(error){
			console.error(error);
			if(!this.state.errorMutex){
				this.setState({errorMutex:true}, () => {
					toast.notify("WARN", this.props.network + " Forno node is not responding");
					setTimeout(() => {
						this.setState({errorMutex:false});
						console.log("errorMutex returned to false");
					}, 10000);
					this.setState({blockNumber: -1});
				});
			}
			else{
				console.log("Skipping notification while errorMutex is true");
			}	
		}
	}

	getRemoteNodeConfig = (network) => {
		const remoteNodeConfig = API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
		console.log(`Using remote node configuration - ${JSON.stringify(remoteNodeConfig)}`);
		return remoteNodeConfig;
	}
    
	getAttestationAPIConfig = (network) => {
		const attestationAPIConfig = ATTESTATIONS_API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
		console.log(`Using attestation API configuration - ${JSON.stringify(attestationAPIConfig)}`);
		return attestationAPIConfig;
	}	

	componentDidMount = () => {
		this.setState({remoteNodeConfig: this.getRemoteNodeConfig(this.props.network)}, 
            
			() => this.setState({attestationAPIConfig: this.getAttestationAPIConfig(this.props.network)}, 
                
				() => {
					const blockNumberIntervalID = setInterval(this.getCurrentBlockNumber, refreshBlockNumberMillis);
					this.setState({blockNumberIntervalID:blockNumberIntervalID});
					
					const attestationsIntervalID = setInterval(this.getAttestations, refreshAttestationsMillis);
					this.setState({attestationsIntervalID:attestationsIntervalID});

					this.getAttestations();
				}

			));
	}

	componentWillUnmount = () => {
		clearInterval(this.state.blockNumberIntervalID);
		clearInterval(this.state.attestationsIntervalID);
	}

	getLinkForAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address;
	}

	getLinkForValidatorAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address + "/celo";
	}

	getLinkForTxId = (txId) => {
		return this.state.remoteNodeConfig.blockExplorer + "tx/" + txId;
	}

	enrichData = async (data) => {		
		data.forEach(async element => {
			
			element["issuerLink"] = this.getLinkForAddress(element.key);
			element["favourite"] = localStorage.getItem("attestation-" + this.props.network + "-" + element.key);
			element["completedRatio"] = Math.round(element.completedCount / element.selectedCount * 100);			
			
			element.attestations.forEach((element, index) => {
				element["issuerSelectedLink"] = this.getLinkForTxId(element.issuerSelected.txId);
				element["completedLink"] = element.completed.txId ? this.getLinkForTxId(element.completed.txId) : null;				
			});

			if(!element["issuerName"]){
				element["issuerName"] = element.key;
			}
			
			try{
				const metadataURL = await getMetadataURL(this.state.remoteNodeConfig.remoteNode, element.key);
				const response = await attestationAPI.getAttestationStatus(this.state.attestationAPIConfig, metadataURL);
				const data = response.data;	
				
				element["attestationURL"] = data.attestationURL;
				element["attestationHealthz"] = data.healthz.status;
				element["attestationStatus"] = data.status;
				if(!element["attestationStatus"].version){
					element["attestationStatus"]["version"] = "-";
				}
			}
			catch(err){

				console.log(`Error retrieving for ${element.key}, retrying via proxy...`);

				try{					
					element["attestationURL"] = await getAttestationURL(this.state.remoteNodeConfig.remoteNode, element.key);
					console.log(`AttestationURL for ${element.key} is ${element.attestationURL}`);
					
					try{
						element["attestationHealthz"] = await getAttestationHealthz(element["attestationURL"]);
					}
					catch(error){
						console.log(`Error retrieving /healthz for ${element.key}, setting to empty`);
						element["attestationHealthz"] = "-";
					}
					
					try{
						element["attestationStatus"] = await getAttestationStatus(element["attestationURL"]);
					}
					catch(error){
						console.log(`Error retrieving /status for ${element.key}, setting to empty`);
						element["attestationStatus"] = {version: "-", status: "-"};
					}

					
					if(!element["attestationStatus"].version){
						element["attestationStatus"]["version"] = "-";
					}
				}
				catch(err){
					element["attestationURL"] = "** CORS error getting metadata **";
					element["attestationHealthz"] = "-";
					element["attestationStatus"] = {version: "-", status: "-"};
				}
			}

			element["status"] = element.attestationStatus.version + " - " + element.attestationStatus.status;
			element["tlsStatus"] = element["attestationURL"].includes("https://");
	
			if(element.favourite === null)
				element.favourite = false;
			else if(element.favourite === "true")
				element.favourite = true;
			else
				element.favourite = false;
		});
	}

	sortAscending = (attributeName) => {		
		const sortFunction = (x, y) => {			
			let a = x[`${attributeName}`];
			let b = y[`${attributeName}`];
	
			if(typeof a === "string"){
				a = a.toLowerCase();
				b = b.toLowerCase();
			}
			return (a === b ? 0 : a > b ? 1 : -1);
		}
		return sortFunction;
	}

	sortDescending = (attributeName) => {		
		const sortFunction = (x, y) => {			
			let b = x[`${attributeName}`];
			let a = y[`${attributeName}`];
	
			if(typeof a === "string"){
				a = a.toLowerCase();
				b = b.toLowerCase();
			}
			return (a === b ? 0 : a > b ? 1 : -1);
		}
		return sortFunction;
	}

	sortByAttribute = (attestations, attributeName, flip) => {	
		
		const sortDirection = this.state.sortDirection;
		
		if(flip){
			if(sortDirection==="descending"){
				this.setState({sortDirection: "ascending"}, this.setState({sortIcon: ascendingIcon}));
				attestations.sort(this.sortAscending(attributeName));
			}
			else{
				this.setState({sortDirection: "descending"}, this.setState({sortIcon: descendingIcon}));
				attestations.sort(this.sortDescending(attributeName));
			}				
		}
		else{
			if(sortDirection==="descending")
				attestations.sort(this.sortDescending(attributeName));
			else
				attestations.sort(this.sortAscending(attributeName));
		}

		this.setState({attestations}, () => {
			this.setState({sortByAttributeName : attributeName});
		});
	}

	getAttestations = () => {

		this.setState({loading:true},  async () => {
			try{
				
				let response = await attestationAPI.getParsedAttestations(this.state.attestationAPIConfig);			
				let data = response.data.parsedAttestations;
				let LastEvaluatedKey = response.data.LastEvaluatedKey;
				
				// Keep retrieving next pages until none left (LastEvaluatedKey is null)
				while(LastEvaluatedKey){
					console.log(`Retrieving next page at LastEvaluatedKey ${JSON.stringify(LastEvaluatedKey)}`);
					response = await attestationAPI.getParsedAttestations(this.state.attestationAPIConfig, LastEvaluatedKey);			
					data = [...response.data.parsedAttestations, ...data];
					LastEvaluatedKey = response.data.LastEvaluatedKey;
				}
				await this.enrichData(data);
            
				this.setState({attestations: data}, () => {
					console.info(this.state);
					this.sortByAttribute(this.state.attestations, this.state.sortByAttributeName, false);					
					this.setState({loading:false}, toast.notify("INFO", "Retrieved parsed attestations"));}
				);
			}
			catch (error) {
				console.log(error);
				toast.notify("WARN","Error retrieving attestations, please refresh");
				const attestations = [];
				this.setState({attestations}, () => this.setState({loading:true}));
			}
		});	
	}

	changeMapScale = (scale) => {
		
		let lookback;
		switch (scale) {
		case 0:
			lookback = 100;
			break;
		case 1:
			lookback = 150;
			break;
		case 2:
			lookback = 200;
			break;
		case 3:
			lookback = 250;
			break;
		case 4:
			lookback = 300;
			break;
		default:
			lookback = 100;
		}

		if(lookback !== this.state.lookback){
			this.setState({loading:true}, () => {
				toast.notify("INFO","Now showing last " + lookback);
				localStorage.setItem(`attestation-scale-${this.props.network}`, lookback);
				this.setState({lookback}, this.setState({loading:false}));
			});
		}
	}

	setAutoRefresh = async (autoRefresh) => {
		
		console.log("Auto-refresh =" + autoRefresh);
		if(this.state.autoRefresh !== autoRefresh){
			console.log("Changing autoRefresh to " + autoRefresh);
			localStorage.setItem(`attestation-autoRefresh-${this.props.network}`, autoRefresh);
			this.setState({autoRefresh});

			if(this.state.autoRefresh){
				const attestationsIntervalID = setInterval(this.getAttestations, refreshAttestationsMillis);
				this.setState({attestationsIntervalID:attestationsIntervalID});
			}
			else{
				clearInterval(this.state.attestationsIntervalID);
			}
		}
	}

	setOnlyFavourites = (onlyFavourites) => {

		const favourites = this.state.attestations.filter((e,i) => e.favourite === true) || [];
		if((favourites.length===0) && (onlyFavourites === true)){
			toast.notify("WARN", "No favourites have been set yet");
		}
		else{
			console.log("Only favourites =" + onlyFavourites);
			if(this.state.onlyFavourites !== onlyFavourites){
				console.log("Changing onlyFavourites to " + onlyFavourites);
				localStorage.setItem(`attestation-onlyFavourites-${this.props.network}`, onlyFavourites);
				this.setState({onlyFavourites});
			}
		}
	}

	toggleFavourite = (issuer) => {

		const issuerToToggle = this.state.attestations.filter((e,i) => e.key === issuer)[0];
		console.log("Issuer to toggle is " + JSON.stringify(issuerToToggle));

		if(issuerToToggle.favourite === false){
			issuerToToggle["favourite"] = true;
			console.log("Setting favourite for attestation-" + this.props.network + "-" + issuer);
			localStorage.setItem("attestation-" + this.props.network + "-" + issuer, true);
		}
		else {
			issuerToToggle["favourite"] = false;
			console.log("Removing favourite for attestation-" + this.props.network + "-" + issuer);
			localStorage.setItem("attestation-" + this.props.network + "-" + issuer, false);
		}
		const attestations = [...this.state.attestations.filter((e,i) => e.key !== issuer), issuerToToggle];
		this.setState({attestations});		
	}

	render = () => {
		return ( 			
			<div className="container-fluid signed-blocks-content">   
				
				<AttestationMapHeader
					
					epochNumber={this.state.epochNumber}
					atBlock={this.state.atBlock}
                    
					changeMapScale={this.changeMapScale}
					scale={this.state.lookback}
                    
					blockNumber={this.state.blockNumber}
					config={this.state.remoteNodeConfig} 
					network={this.props.network}
                    
					setAutoRefresh={this.setAutoRefresh}
					autoRefresh={this.state.autoRefresh}
                    
					setOnlyFavourites={this.setOnlyFavourites}
					onlyFavourites={this.state.onlyFavourites}
                				
				/>

				<AttestationMapTable 
					toggleFavourite={this.toggleFavourite}
					config={this.state.remoteNodeConfig} 
					loading={this.state.loading} 
					lookback={this.state.lookback} 
					atBlock={this.state.atBlock} 
					blockNumber={this.state.blockNumber} 
					attestations={this.state.onlyFavourites ? this.state.attestations.filter((e,i) => e.favourite === true) : this.state.attestations}
					sortIcon={this.state.sortIcon}
					sortByAttribute={this.sortByAttribute}
					sortByAttributeName={this.state.sortByAttributeName}
				/>
				<ToastContainer autoClose={toast.DEFAULT_AUTOCLOSE}/>
				<hr />
			</div>
		);
	}  
}

export default AttestationMap;