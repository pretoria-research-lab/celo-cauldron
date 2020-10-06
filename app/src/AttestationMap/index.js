import React, {Component} from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import * as toast from "../Common/Notification";
import "../SignedBlocks/signed-blocks.css";
import "./attestation-map.css";
import {ATTESTATIONS_API_CONFIG, API_CONFIG} from "../Utils/config";
import {getCurrentBlockNumber, getCurrentEpochNumber} from "../Utils/utils";
import AttestationService from "../AttestationService";
import AttestationMapTable from "./AttestationMapTable";
import AttestationMapHeader from "./AttestationMapHeader";
import {getAttestationURL} from "../Utils/utils";

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

		const autoRefresh = localStorage.getItem("autoRefresh") === "true" ? true : false;
		const onlyFavourites = localStorage.getItem("onlyFavourites") === "true" ? true : false;
		const scale = parseInt(localStorage.getItem("scale")) || this.props.lookback;
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
			errorMutex: false
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
						console.log("errorMutext returned to false");
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
			element["validatorLink"] = this.getLinkForValidatorAddress(element.issuerName);
			element["favourite"] = localStorage.getItem(element.issuer);
			element["completedRatio"] = Math.round(element.completedCount / element.selectedCount * 100);			
			element.attestations.forEach((element, index) => {
				element["issuerSelectedLink"] = this.getLinkForTxId(element.issuerSelected.txId);
				element["completedLink"] = this.getLinkForTxId(element.completed.txId);				
			});		
			
			try{
				element["attestationURL"] = await getAttestationURL(this.state.remoteNodeConfig.remoteNode, element.key);
			}
			catch(err){
				element["attestationURL"] = "Could not retrieve";
			}			
	
			if(element.favourite === null)
				element.favourite = false;
			else if(element.favourite === "true")
				element.favourite = true;
			else
				element.favourite = false;
		});
	}

	sortByRatio = (attestations, flip) => {	
		attestations.sort((x, y) => {
			let a = x.completedRatio, b = y.completedRatio;
			if(flip){ a = y.completedRatio; b = x.completedRatio;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	}

	sortByCompleted = (attestations, flip) => {	
		attestations.sort((x, y) => {
			let a = x.completedCount, b = y.completedCount;
			if(flip){a = y.completedCount; b = x.completedCount;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	}

	getAttestations = () => {

        this.setState({loading:true},  async () => {
            try{
                const response = await attestationAPI.getParsedAttestations(this.state.attestationAPIConfig);            
                var data = response.data;                
                toast.notify("INFO", "Retrieved parsed attestations");

				await this.enrichData(data);
				this.sortByCompleted(data, true);
            
                this.setState({attestations: data}, () => {
					console.log(this.state);
                    this.setState({loading:false});}
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
			lookback = 200;
			break;
		case 2:
			lookback = 300;
			break;
		default:
			lookback = 100;
		}

		if(lookback !== this.state.lookback){
			this.setState({loading:true}, () => {
				toast.notify("INFO","Scale updated to " + lookback);
				localStorage.setItem("scale", lookback);
				this.setState({lookback}, this.setState({loading:false}));
			});
		}
	}

	setAutoRefresh = async (autoRefresh) => {
		console.log("Auto-refresh =" + autoRefresh);
		if(this.state.autoRefresh !== autoRefresh){
			console.log("Changing autoRefresh to " + autoRefresh);
			localStorage.setItem("autoRefresh", autoRefresh);
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

	setOnlyFavourites = (onlyFavourites, event) => {

		const favourites = this.state.attestations.filter((e,i) => e.favourite === true) || [];
		if((favourites.length===0) && (onlyFavourites === true)){
			toast.notify("WARN", "No favourites have been set yet");
		}
		else{
			console.log("Only favourites =" + onlyFavourites);
			if(this.state.onlyFavourites !== onlyFavourites){
				console.log("Changing onlyFavourites to " + onlyFavourites);
				localStorage.setItem("onlyFavourites", onlyFavourites);
				this.setState({onlyFavourites});
			}
		}
	}

	toggleFavourite = (issuer) => {

		const issuerToToggle = this.state.attestations.filter((e,i) => e.key === issuer)[0];
		console.log("Issuer to toggle is " + JSON.stringify(issuerToToggle));

		if(issuerToToggle.favourite === false){
			issuerToToggle["favourite"] = true;
			console.log("Setting favourite for " + issuer);
			localStorage.setItem(issuer, true);
		}
		else {
			issuerToToggle["favourite"] = false;
			console.log("Removing favourite for " + issuer);
			localStorage.setItem(issuer, false);
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
					sortByValidatorName={this.sortByValidatorName} 
					sortBySignerAddress={this.sortBySignerAddress}
					sortBySignedCount={this.sortBySignedCount}
					sortByMissedCount={this.sortByMissedCount}
					toggleFavourite={this.toggleFavourite}
					config={this.state.remoteNodeConfig} 
					loading={this.state.loading} 
					lookback={this.state.lookback} 
					atBlock={this.state.atBlock} 
					blockNumber={this.state.blockNumber} 
					attestations={this.state.onlyFavourites ? this.state.attestations.filter((e,i) => e.favourite === true) : this.state.attestations}/>

				<ToastContainer autoClose={toast.DEFAULT_AUTOCLOSE}/>
				<hr />
			</div>
		);
	}  
}

export default AttestationMap;