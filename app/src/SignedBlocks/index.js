import React, {Component} from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import * as toast from "../Common/Notification";
import "./signed-blocks.css";
import {API_CONFIG, SIGNED_BLOCKS_API_CONFIG} from "../Utils/config";
import {getCurrentBlockNumber, getCurrentEpochNumber} from "../Utils/utils";
import SignedBlocksService from "../SignedBlocksService";
import SignedBlocksTable from "./SignedBlocksTable";
import SignedBlocksHeader from "./SignedBlocksHeader";
import SignedBlocksPaginator from "./SignedBlocksPaginator";

import * as contractkit from "@celo/contractkit";

const signedBlocksAPI = new SignedBlocksService();
const refreshBlockNumberMillis = 1000;
const highwatermarkRefreshMillis = 1000;
const baseScale = 100;

class SignedBlocks extends Component 
{

	static get propTypes() { 
		return { 
			network: PropTypes.any,
			lookback: PropTypes.any
		}; 
	}

	constructor(props){
		super(props);

		const stayAtHead = localStorage.getItem("stayAtHead") === "true" ? true : false;
		const scale = parseInt(localStorage.getItem("scale")) || this.props.lookback;
		console.log(`Retrieved previous settings, stayAtHead ${stayAtHead}, scale ${scale}`);

		this.state	=	{	pageList: [], 
			lookback: scale, 
			atBlock: -1, 
			signatures: [], 
			loading: true, 
			signedBlocksAPIConfig: {}, 
			remoteNodeConfig: {}, 
			blockNumber: 0, 
			processing: false,
			stayAtHead: stayAtHead,
			highwatermark: { atBlock: 0},
			epoch: -1
		};
	}

	getCurrentBlockNumber = async () => {
		try{
			const nodeProvider = this.state.remoteNodeConfig.remoteNode;
			const blockNumber = await getCurrentBlockNumber(nodeProvider);
			const epochNumber = await getCurrentEpochNumber(nodeProvider, blockNumber);
			this.setState({blockNumber: blockNumber}, () => this.setState({epochNumber: epochNumber}));
		}catch(error){
			toast.notify("ERROR", this.props.network + " is not responding");
			this.setState({blockNumber: -1});
		}
	}

	getRemoteNodeConfig = (network) => {
		const remoteNodeConfig = API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
		console.log(`Using remote node configuration - ${JSON.stringify(remoteNodeConfig)}`);
		return remoteNodeConfig;
	}	

	getSignedBlocksAPIConfig = (network) => {
		const signedBlocksAPIConfig = SIGNED_BLOCKS_API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
		console.log(`Using signed blocks API configuration - ${JSON.stringify(signedBlocksAPIConfig)}`);
		return signedBlocksAPIConfig;
	}

	getHeadBlock = () => {
		return this.state.highwatermark.atBlock;
	}

	getHighwatermark = async () => {
		try{
			const previousHighwatermark = this.state.highwatermark;
			const highwatermark = (await signedBlocksAPI.getHighwatermark(this.state.signedBlocksAPIConfig)).data;
			
			this.setState({highwatermark}, async () => {
				
				if(this.state.stayAtHead && (previousHighwatermark.atBlock !== highwatermark.atBlock)) {
	
					const from = highwatermark.atBlock - this.state.lookback + 1;
					const to = highwatermark.atBlock;
					const results = await signedBlocksAPI.getBlocks(this.state.signedBlocksAPIConfig, from, to);
					
					this.enrichData(results.data);

					this.setState({signatures: results.data}, 
						() => this.setState({atBlock: highwatermark.atBlock},
							() => this.setState({pageList: this.createPageList()},
								() => this.state.currentSortFunction(this.state.currentSortDirection)
							)));
				}					
			});
		}
		catch(error){
			console.log("Highwatermark not found, likely still being written");
		}	
	}

	initialise = async () => {
	
		await this.getHighwatermark();
		const atBlock = this.getHeadBlock();

		const blockNumberIntervalID = setInterval(this.getCurrentBlockNumber, refreshBlockNumberMillis);
		this.setState({blockNumberIntervalID:blockNumberIntervalID});

		const highwatermarkIntervalID = setInterval(this.getHighwatermark, highwatermarkRefreshMillis);
		this.setState({highwatermarkIntervalID:highwatermarkIntervalID});
		
		this.setState({atBlock}, 
			() => this.setState({currentSortFunction: this.sortByMissedCount}, 
				() => {	const pageList = this.createPageList();
					this.setState({pageList}, () => this.getSignatures());
				}
			));
	}

	componentDidMount = () => {

		this.setState({remoteNodeConfig: this.getRemoteNodeConfig(this.props.network)}, 
			() => this.setState({signedBlocksAPIConfig: this.getSignedBlocksAPIConfig(this.props.network)}, 
				() => this.initialise()
			));		
	}

	componentWillUnmount = () => {
		clearInterval(this.state.blockNumberIntervalID);
		clearInterval(this.state.highwatermarkIntervalID);
	}

	getAccountName = async (address, atBlock) => {		
		let accountName = address;
		try{
			const kit = contractkit.newKit(this.state.remoteNodeConfig.remoteNode);
			const accounts = await kit.contracts.getAccounts();
			const validatorName = await accounts.getName(address);
			accountName = validatorName;
		}
		catch(e){
			toast.notify("WARN",`Error retrieving name for ${address}, ignoring`);
			console.log(e);
			accountName = address;		
		}
		return accountName;
	}

	getValidatorFromSigner = async (signerAddress, atBlock) => {
		let validatorAddress = "0x";
		try{
			const kit = contractkit.newKit(this.state.remoteNodeConfig.remoteNode);
			const accounts = await kit.contracts.getAccounts();
			validatorAddress = await accounts.signerToAccount(signerAddress);
		}
		catch(e){
			console.log(e);
			toast.notify("WARN",`Error retrieving validator for ${signerAddress}, ignoring`);	
		}
		return validatorAddress;
	}

	sortByValidatorName = (flip) => {
		const signatures = this.state.signatures;
		signatures.sort((x, y) => {
			let a = (x.validatorName ? x.validatorName : x.validatorAddress).toLowerCase(),	b = (y.validatorName ? y.validatorName : y.validatorAddress).toLowerCase();
			if(flip){a = (y.validatorName ? y.validatorName : y.validatorAddress).toLowerCase(); b = (x.validatorName ? x.validatorName : x.validatorAddress).toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
		this.setState({currentSortDirection: flip}, () => this.setState({currentSortFunction: this.sortByValidatorName}));
	}
	sortBySignerAddress = (flip) => {
		const signatures = this.state.signatures;
		signatures.sort((x, y) => {			
			let a = x.signer.toLowerCase(),	b = y.signer.toLowerCase();
			if(flip){a = y.signer.toLowerCase(); b = x.signer.toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
		this.setState({currentSortDirection: flip}, () => this.setState({currentSortFunction: this.sortBySignerAddress}));
	}
	sortBySignedCount = (flip) => {
		const signatures = this.state.signatures;
		signatures.sort((x, y) => {
			let a = x.counts.signatures, b = y.counts.signatures;
			if(flip){a = y.counts.signatures; b = x.counts.signatures;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
		this.setState({currentSortDirection: flip}, () => this.setState({currentSortFunction: this.sortBySignerAddress}));
	}
	sortByMissedCount = (flip) => {
		const signatures = this.state.signatures;
		signatures.sort((x, y) => {
			let a = x.counts.missedSignatures, b = y.counts.missedSignatures;
			if(flip){ a = y.counts.missedSignatures; b = x.counts.missedSignatures;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
		this.setState({currentSortDirection: flip}, () => this.setState({currentSortFunction: this.sortByMissedCount}));
	}

	getLinkForAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address;
	}

	getLinkForValidatorAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address + "/celo";
	}

	enrichData = (data) => {		
		data.forEach(element => {
			element["signerLink"] = this.getLinkForAddress(element.signer);
			element["validatorLink"] = this.getLinkForValidatorAddress(element.validatorAddress);
			element["favourite"] = localStorage.getItem(element.signer);
			
			if(element.favourite === null)
				element.favourite = false;
			else if(element.favourite === "true")
				element.favourite = true;
			else
				element.favourite = false;
		});
	}

	getSignatures = () => { 
		if(!this.state.atBlock){
			toast.notify("WARN","Waiting to receive current block number");
		}
		else{
			this.setState({loading:true}, async () => {
				try{
					const response = await signedBlocksAPI.getBlocks(this.state.signedBlocksAPIConfig, this.state.atBlock-this.state.lookback+1, this.state.atBlock);
					var data = response.data;
					
					toast.notify("INFO", "Retrieved signatures at block " + this.state.atBlock);	
						
					this.enrichData(data);
				
					this.setState({signatures: data}, () => {
						console.log(this.state);
						this.sortByMissedCount(true);
						this.setState({loading:false});}
					);
				}
				catch (error) {
					console.log(error);
					toast.notify("WARN","Error retrieving signatures, please refresh");
					const signatures = [];
					this.setState({signatures}, () => this.setState({loading:true}));
				}
			});
		}		
	}

	createPageList = () => {

		var pageList = [];
		let minPage = this.state.signedBlocksAPIConfig.firstBlock + this.state.lookback - baseScale; // quoroum was reached and database begins

		console.log("lookback = " + this.state.lookback);

		let maxPage = this.getHeadBlock(); // max page is always moving forward

		const listLength = this.state.signedBlocksAPIConfig.paginationListLength;
		const atBlock = this.state.atBlock;
		const lookback = this.state.lookback;
		let addedPrevious = false;
		let addedNext = false;

		console.log(`Creating pagelist with ${atBlock} as the active page ${minPage} as the first and ${maxPage} as the last page`);
		
		// Add earlier pages, only down to the minimum
		for(let i=(listLength/2);i>0;i--){
			if((atBlock-(i*lookback)) > minPage){
				pageList.push(
					{   atBlock: (atBlock-(i*lookback)),
						active: false
					}        
				);
				addedPrevious = true;
			}
		}

		// Add pivot page
		pageList.push(
			{   atBlock: atBlock,
				active: true
			}
		);

		// Add later pages, only up to the maximum
		for(let i=1;i<=(listLength/2);i++){
			if((atBlock+(i*lookback))<=maxPage){
				pageList.push(
					{   atBlock: (atBlock+(i*lookback)),
						active: false
					}        
				);
				addedNext = true;
			}
		}
		
		// If we haven't filled up length of pages, add in remainder (on either side of the pivot)
		if(pageList.length < (listLength+1)){

			const iterations = ((listLength+1)-pageList.length); 

			for(let i=0; i < iterations; i++){
				if(addedPrevious){
					const newPageList = [
						{   atBlock: (pageList[0].atBlock-lookback),
							active: false
						}, 
						...pageList ];
					pageList = newPageList;
				} else if (addedNext) {
					const newPageList = [
						...pageList, 	
						{   atBlock: (pageList[pageList.length-1].atBlock+lookback),
							active: false
						}];
					pageList = newPageList;
				}
			}
		}
		return pageList;
	}

	changeToFirstPage = () => {
		const firstPage = this.state.signedBlocksAPIConfig.firstBlock + this.state.lookback - baseScale;
		this.changePage(firstPage);
	}

	changeToLastPage = () => {
		this.changePage(this.getHeadBlock());
	}

	changePage = (atBlock) => {
		console.log(`Changing block map to atBlock ${atBlock} with range of ${this.state.lookback}`);
		this.setState({atBlock}, 
			async () => 
			{	const pageList = this.createPageList();
				this.setState({pageList}, () => this.getSignatures());
			}
		);
	}

	changeMapScale = (scale) => {
		
		let lookback;
		clearInterval(this.state.highwatermarkIntervalID);

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
				this.setState({lookback}, () => {
					this.createPageList();
					this.changePage(this.state.atBlock);
					const highwatermarkIntervalID = setInterval(this.getHighwatermark, highwatermarkRefreshMillis);
					this.setState({highwatermarkIntervalID:highwatermarkIntervalID});
				});
			});
		}
	}

	stayAtHead = async (stayAtHead) => {
		// event.preventDefault();
		console.log("Stay at head =" + stayAtHead);
		if(this.state.stayAtHead !== stayAtHead){
			console.log("Changing stayAtHead to " + stayAtHead);
			localStorage.setItem("stayAtHead", stayAtHead);
			this.setState({stayAtHead}, () => {
				if(this.state.stayAtHead === true)
					this.changeToLastPage();
			});
		}
	}

	toggleFavourite = (signer) => {

		const signerToToggle = this.state.signatures.filter((e,i) => e.signer === signer)[0];

		console.log("Signer to toggle is " + JSON.stringify(signerToToggle));

		if(signerToToggle.favourite === false){
			signerToToggle["favourite"] = true;
			console.log("Setting favourite for " + signer);
			localStorage.setItem(signer, true);
		}
		else {
			signerToToggle["favourite"] = false;
			console.log("Removing favourite for " + signer);
			localStorage.setItem(signer, false);
		}
		const signatures = [...this.state.signatures.filter((e,i) => e.signer !== signer), signerToToggle];
		this.setState({signatures});		
	}

	jumpToBlock = (atBlock) => {

		console.log("Jumping to block " + atBlock);

		const maxPage =  this.getHeadBlock();
		
		if(atBlock < (this.state.signedBlocksAPIConfig.firstBlock + this.state.lookback - baseScale))
			toast.notify("WARN","Block cannot be less than " + (this.state.signedBlocksAPIConfig.firstBlock + this.state.lookback - baseScale));
		else if (atBlock > maxPage)
			toast.notify("WARN","Block cannot be greater than " + maxPage);
		else
			this.changePage(+atBlock);
	}

	render = () => {
		return ( 			
			<div className="container-fluid signed-blocks-content">   
				<SignedBlocksHeader
					jumpToBlock={this.jumpToBlock} 
					epochNumber={this.state.epochNumber}
					atBlock={this.state.atBlock}
					changeMapScale={this.changeMapScale}
					scale={this.state.lookback}
					stayAtHead={this.stayAtHead}
					checked={this.state.stayAtHead}
					blockNumber={this.state.blockNumber}
					config={this.state.remoteNodeConfig} network={this.props.network}
				/>
				{this.state.loading ? "" : 
					<SignedBlocksPaginator 
						pageList={this.state.pageList} 
						changeToFirstPage={this.changeToFirstPage}
						changeToLastPage={this.changeToLastPage}
						changeSignatureMap={this.changePage}
					/>}
				<SignedBlocksTable 
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
					signatures={this.state.signatures}/>
				<ToastContainer autoClose={toast.DEFAULT_AUTOCLOSE}/>
				<hr />
			</div>
		);
	}  
}

export default SignedBlocks;