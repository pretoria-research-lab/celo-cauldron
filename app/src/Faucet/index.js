import React, {Component} from 'react';
import './faucet.css';
import {API_CONFIG} from '../Config'
import FaucetService from '../FaucetService';
import FaucetQueueTable from './FaucetQueueTable';
import FaucetHeader from './FaucetHeader';
import FaucetInformation from './FaucetInformation';

const faucetService = new FaucetService();

class Faucet extends Component 
{
  constructor(props){
	  super(props);
      this.state = {faucetRequests: [], loading: false, faucetBalance: 0, config: {}};
  };

  getConfig = (network) => {
    const config = API_CONFIG.filter((item) => item.network.toLowerCase() === network.toLowerCase())[0];
    console.log(`Using configuration - ${JSON.stringify(config)}`);
    return config;
  }

  componentDidMount(){
      this.setState({config: this.getConfig(this.props.network)}, () => {
        this.getAllRequests();
      });        
  }

  claimRequest = (faucetRequest) => {
    this.setState({loading:true}, async () => 
    {
      try{
        console.log(this.state);
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
        <FaucetInformation config={this.state.config} network={this.props.network} faucetBalance={this.state.faucetBalance}/>
        <FaucetQueueTable loading={this.state.loading} faucetRequests={this.state.faucetRequests} claimRequest={this.claimRequest} createRequest={this.createRequest}/>          
      </div>
    );
  }  
}

export default Faucet;