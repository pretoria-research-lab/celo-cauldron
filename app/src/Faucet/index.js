import React, {Component} from 'react';
import {Jumbotron} from 'react-bootstrap';
import './faucet.css';
import developerLogo from '../assets/01-Developers (light bg).png';
import loadingImg from '../assets/loading.svg';
import * as web3Utils from 'web3-utils';
import {API_CONFIG} from '../Config'
import FaucetService from '../FaucetService';
import FaucetQueueTable from './FaucetQueueTable';

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
    try{
      this.setState({loading:true}, async () => {
        console.log(this.state);
        const response = await faucetService.claimRequest(this.state.config, faucetRequest.address);
        const claimResult = response.data.claimResult;
        console.log(claimResult);
        this.setState({loading:false});
      });
    } catch (error) {
      alert("claimRequest - " + error);
      this.setState({loading:false});
    }
  }

  getAllRequests = () => {
    try{
      this.setState({loading:true}, async () => {
        console.log(this.state);
        const response = await faucetService.getAllRequests(this.state.config);
        const faucetRequests = response.data.faucetRequests;
        const faucetBalance = response.data.faucetBalance;
        faucetRequests.forEach(element => {
          element["addressLink"] = this.state.config.blockExplorer + "address/" + element.address;
          element["txLink"] = this.state.config.blockExplorer + "tx/" + element.txId;
        });
        this.setState({faucetRequests}, () => this.setState({faucetBalance}, () => this.setState({loading:false})));
      });
    } catch (error) {
      alert("getAllRequests - " + error);
      const faucetRequests = [];
      this.setState({faucetRequests}, () => this.setState({loading:false}));
    }
  } 

  isETHAddress = (address) => {
    return web3Utils.isAddress(address);
  }

  render = () => {

    const { network } = this.props;

    return ( 

      <div className="container-fluid">
        
        <div className="row">
          <div className="col-lg-12 text-center jumbo-primary">
            <Jumbotron>
              <h1 className="mt"><img id="developer-logo" src={developerLogo} alt="Developer logo" />Developer Faucet</h1>
              <hr/>
              <p className="technical">{network + " Faucet "}{this.state.config ? <a href={this.state.config.blockExplorer + "/address/" + this.state.config.faucetAddress}>{this.state.config.faucetAddress}</a> : ""}</p>
              <hr/>
              <p className="technical">{"Current Balance " + this.state.faucetBalance + " cGLD"}</p>
            </Jumbotron>
          </div>          
          <div className="row">
            <div className="col-lg-12">
            { this.state.loading ? <img src={loadingImg} alt="Loading..." /> :
              <FaucetQueueTable faucetRequests={this.state.faucetRequests} claimRequest={this.claimRequest} />
            }
            </div>
          </div>          
        </div>
      </div>
    );
  }  
}

export default Faucet;