import React, {Component} from 'react';
import './faucet.css';
import {API_CONFIG} from '../Utils/config';
import {getCurrentBlockNumber} from '../Utils/utils';
import FaucetService from '../FaucetService';
import FaucetQueueTable from './FaucetQueueTable';
import FaucetHeader from './FaucetHeader';
import FaucetInformation from './FaucetInformation';

const faucetService = new FaucetService();
const refreshBlockNumberMillis = 5000;

class Faucet extends Component 
{
  constructor(props){
	  super(props);
      this.state = {faucetRequests: [], loading: false, faucetBalance: 0, config: {}, blockNumber: -1, processing: false};
  };

  prepareReadyRequests = () => {

    if(!this.state.processing) {
      let processing = true;
      this.setState({processing}, () => {
        
        const blockNumber = this.state.blockNumber;
        console.log(`Processing current requests @ blockNumber ${blockNumber} ...`);        
        const faucetRequests = this.state.faucetRequests;
            
        faucetRequests.forEach((fr) => {
          if((fr.status === "REQUESTED") && (blockNumber - fr.createdBlockNumber) >= this.state.config.blocksCooldown){
            this.claimRequest(fr);
          }
        });

        processing = false;
        this.setState({processing});    
      });  
    }
    else {
      console.log("Already processing, avoid reentrancy");
    }
  }

  getBlockNumber = async () => {
    try{
      const nodeProvider = this.state.config.remoteNode;
      const blockNumber = await getCurrentBlockNumber(nodeProvider);
      this.setState({blockNumber: blockNumber}, () => this.prepareReadyRequests());
    }catch(e){
      console.log("Error retrieving block number:" + e);
      this.setState({blockNumber: -1});
    }
  }

  getConfig = (network) => {
    const config = API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
    console.log(`Using configuration - ${JSON.stringify(config)}`);
    return config;
  }

  componentDidMount(){
      this.setState({config: this.getConfig(this.props.network)}, () => {
        setInterval(this.getBlockNumber, refreshBlockNumberMillis);
        this.getAllRequests();
      });        
  }

  claimRequest = (faucetRequest) => {
    this.setState({loading:true}, async () => 
    {
      try{
        console.log("Claiming for request " + JSON.stringify(faucetRequest));
        const response = await faucetService.claimRequest(this.state.config, faucetRequest.address);
        const claimResult = response.data.claimResult;
        console.log(claimResult);
        this.getAllRequests();
        this.setState({loading:false});
      }
      catch (error) {
        alert("claimRequest - " + error);
        this.setState({loading:false});
      }
    });
  }

  createRequest = (address) => {
    this.setState({loading:true}, async () => 
    {
      try{
        console.log(this.state);
        const response = await faucetService.createRequest(this.state.config, address);
        const createResult = response.data;
        console.log(createResult);
        this.getAllRequests();
        this.setState({loading:false});
      }
      catch (error) {
        alert("createRequest - " + error);
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
        this.setState({faucetRequests}, () => this.setState({faucetBalance}, () => this.setState({loading:false})));
      }
      catch (error) {
        alert("getAllRequests - " + error);
        const faucetRequests = [];
        this.setState({faucetRequests}, () => this.setState({loading:false}));
      }
    });
  } 

  render = () => {

    return ( 
      <div className="container-fluid">        
        <FaucetHeader config={this.state.config} network={this.props.network}/>
        <FaucetInformation config={this.state.config} blockNumber={this.state.blockNumber} network={this.props.network} faucetBalance={this.state.faucetBalance}/>
        <FaucetQueueTable config={this.state.config} loading={this.state.loading} blockNumber={this.state.blockNumber} faucetRequests={this.state.faucetRequests} createRequest={this.createRequest}/>
      </div>
    );
  }  
}

export default Faucet;