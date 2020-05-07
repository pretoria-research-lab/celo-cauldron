import React, {Component} from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signed-blocks.css";
import {API_CONFIG, SIGNED_BLOCKS_API_CONFIG} from "../Utils/config";
import {getCurrentBlockNumber} from "../Utils/utils";
import SignedBlocksService from "../SignedBlocksService";
import SignedBlocksTable from "./SignedBlocksTable";
import SignedBlocksHeader from "./SignedBlocksHeader";
import SignedBlocksPaginator from "./SignedBlocksPaginator";
import * as contractkit from "@celo/contractkit";

const signedBlocksAPI = new SignedBlocksService();
const refreshBlockNumberMillis = 5000;

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
		this.state	=	{	pageList: [], 
			lookback: this.props.lookback, 
			atBlock: -1, 
			signatures: [], 
			loading: true, 
			signedBlocksAPIConfig: {}, 
			remoteNodeConfig: {}, 
			blockNumber: 0, 
			processing: false,
			maxBlockNumber: 0
		};
	}

	notify = (type, message) => {
		if(type==="SUCCESS")
			toast.success(message, {position: toast.POSITION.TOP_RIGHT, className: "toastSuccess"});
		else if(type==="INFO")
			toast.info(message, {position: toast.POSITION.TOP_RIGHT, className: "toastInfo"});
		else if(type==="WARN")
			toast.warn(message, {position: toast.POSITION.TOP_RIGHT, className: "toastWarn"});
		else if(type==="ERROR")
			toast.error(message, {position: toast.POSITION.TOP_RIGHT, className: "toastError"});
		else
			toast.info(message, {position: toast.POSITION.TOP_RIGHT, className: "toastInfo"});
	}

	getBlockNumber = async () => {
		try{
			const nodeProvider = this.state.remoteNodeConfig.remoteNode;
			const blockNumber = await getCurrentBlockNumber(nodeProvider);
			this.setState({blockNumber: blockNumber}, () => {
				const maxBlockNumber = this.calculateMaxAtBlock(this.state.blockNumber);
				this.setState({maxBlockNumber});
			});
		}catch(error){
			this.notify("ERROR", this.props.network + " is not responding");
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

	calculateMaxAtBlock = (currentBlockNumber) => {
		return (currentBlockNumber - (currentBlockNumber % this.state.lookback) - this.state.lookback);
	}

	initialiseStartingBlockNumber = async () => {
		await this.getBlockNumber();
		const currentBlockNumber = this.state.blockNumber;
		const atBlock = this.calculateMaxAtBlock(currentBlockNumber);

		const blockNumberIntervalID = setInterval(this.getBlockNumber, refreshBlockNumberMillis);
		this.setState({blockNumberIntervalID:blockNumberIntervalID});
		
		this.setState({atBlock}, () => {			
			const pageList = this.createPageList();
			this.setState({pageList}, () => this.getSignatures());
		});
	}

	componentDidMount = () => {
		
		this.setState({remoteNodeConfig: this.getRemoteNodeConfig(this.props.network)}, () => {
			this.setState({signedBlocksAPIConfig: this.getSignedBlocksAPIConfig(this.props.network)}, () => {
				this.initialiseStartingBlockNumber();
			});			
		});    
	}

	componentWillUnmount = () => {
		clearInterval(this.state.blockNumberIntervalID);
	}

	processError = (error) => {
		if (error.response) {
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
			error.response.data.message ? this.notify("ERROR", error.response.data.message) : this.notify("ERROR", error.response.data);
		} else if (error.request) {
			console.log(error.request);
			this.notify("ERROR", error.request);
		} else {
			console.log(error.message);
			this.notify("ERROR", error.message);
		}
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
			this.notify("WARN",`Error retrieving name for ${address}, ignoring`);
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
			this.notify("WARN",`Error retrieving validator for ${signerAddress}, ignoring`);	
		}
		return validatorAddress;
	}

	sortByValidatorName = (flip) => {
		const signatures = this.state.signatures;
		signatures.signatures.sort((x, y) => {
			let a = (x.validatorName ? x.validatorName : x.validatorAddress).toLowerCase(),	b = (y.validatorName ? y.validatorName : y.validatorAddress).toLowerCase();
			if(flip){a = (y.validatorName ? y.validatorName : y.validatorAddress).toLowerCase(); b = (x.validatorName ? x.validatorName : x.validatorAddress).toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
	}
	sortBySignerAddress = (flip) => {
		const signatures = this.state.signatures;
		signatures.signatures.sort((x, y) => {			
			let a = x.signer.toLowerCase(),	b = y.signer.toLowerCase();
			if(flip){a = y.signer.toLowerCase(); b = x.signer.toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
	}
	sortBySignedCount = (flip) => {
		const signatures = this.state.signatures;
		signatures.signatures.sort((x, y) => {
			let a = x.counts.signatures, b = y.counts.signatures;
			if(flip){a = y.counts.signatures; b = x.counts.signatures;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
	}
	sortByMissedCount = (flip) => {
		const signatures = this.state.signatures;
		signatures.signatures.sort((x, y) => {
			let a = x.counts.missedSignatures, b = y.counts.missedSignatures;
			if(flip){ a = y.counts.missedSignatures; b = x.counts.missedSignatures}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
		this.setState({signatures});
	}

	getLinkForAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address;
	}

	getLinkForValidatorAddress = (address) => {
		return this.state.remoteNodeConfig.blockExplorer + "address/" + address + "/celo";
	}

	getSignatures = () => { 
		if(!this.state.atBlock){
			this.notify("WARN","Waiting to receive current block number");
		}
		else{
			this.setState({loading:true}, async () => {
				try{
					const response = await signedBlocksAPI.getSingle(this.state.signedBlocksAPIConfig, this.state.atBlock, this.state.lookback);
					var data = response.data;
					
					this.notify("INFO", "Retrieved signatures at block " + this.state.atBlock);	

					// Enrich with signer link
					data.signatures.forEach(element => {
						element["signerLink"] = this.getLinkForAddress(element.signer);
					});

					// Enrich with validator address and name if they haven't been supplied
					data.signatures.forEach(async element => {
						console.log("Element " + JSON.stringify(element));
						if(!element.validatorName){
							element["validatorAddress"] = "Loading ...";
							element["validatorAddress"] = await this.getValidatorFromSigner(element.signer, this.state.atBlock);
						}
						element["validatorLink"] = this.getLinkForValidatorAddress(element.validatorAddress);						
						
						if(!element.validatorName){
							element["validatorName"] = "Loading ...";
							element["validatorName"] = await this.getAccountName(element["validatorAddress"], this.state.atBlock);
						}							
					});
				
					this.setState({signatures: data}, () => {
						console.log(this.state);
						this.sortByMissedCount(true);
						this.setState({loading:false});}
					);
				}
				catch (error) {
					console.log(error);
					this.notify("WARN","Error retrieving signatures, please refresh");
					const signatures = [];
					this.setState({signatures}, () => this.setState({loading:true}));
				}
			});
		}
		
	}

	createPageList = () => {

		var pageList = [];
		const minPage = this.state.signedBlocksAPIConfig.firstBlock; // quoroum was reached and database begins
		const maxPage = this.calculateMaxAtBlock(this.state.blockNumber); // max page is always moving forward
		const listLength = this.state.signedBlocksAPIConfig.paginationListLength;
		const atBlock = this.state.atBlock;
		const lookback = this.state.lookback;
		let addedPrevious = false;
		let addedNext = false;

		console.log(`Creating pagelist with ${atBlock} as the active page and ${maxPage} as the last page`);
		
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

			console.log("pageList.length == " +pageList.length);
			console.log("listLength + 1 == " + (listLength + 1));
			const iterations = ((listLength+1)-pageList.length); 

			for(let i=0; i < iterations; i++){
				if(addedPrevious){
					console.log("Adding " + (pageList[0].atBlock-lookback));
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
		// Log
		console.table(pageList);

		return pageList;
	}

	changeToFirstPage = () => {
		const firstPage = this.state.signedBlocksAPIConfig.firstBlock;
		this.changePage(firstPage);
	}

	changeToLastPage = () => {
		const lastPage = this.calculateMaxAtBlock(this.state.blockNumber);
		this.changePage(lastPage);
	}

	changePage = (atBlock) => {
		console.log(`Changing block map to atBlock ${atBlock} with lookback ${this.state.lookback}`);
		this.setState({atBlock}, 
			() => this.setState({pageList: this.createPageList()}, 
				() => this.getSignatures()));
	}

	jumpToBlock = (atBlock) => {

		console.log("Jumping to block " + atBlock);

		if(atBlock % this.state.lookback !== 0){
			this.notify("WARN","Please select a block in " + this.state.lookback + " increments");
		}
		else {
			const maxPage =  this.calculateMaxAtBlock(this.state.blockNumber);
			if(atBlock < this.state.signedBlocksAPIConfig.firstBlock){
				this.notify("WARN","Block cannot be less than " + this.state.signedBlocksAPIConfig.firstBlock);
			}
			else if (atBlock > maxPage){
				this.notify("WARN","Block cannot be greater than " + maxPage);
			}
			else{
				this.changePage(+atBlock);
			}
		}
	}

	render = () => {
		return ( 
			<div className="container-fluid signed-blocks-content">   
				<SignedBlocksHeader
					jumpToBlock={this.jumpToBlock} 
					atBlock={this.state.atBlock}
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
					config={this.state.remoteNodeConfig} 
					loading={this.state.loading} 
					lookback={this.state.lookback} 
					atBlock={this.state.atBlock} 
					blockNumber={this.state.blockNumber} 
					signatures={this.state.signatures.signatures}/>
				<ToastContainer autoClose={4000}/>
				<hr />
			</div>
		);
	}  
}

export default SignedBlocks;