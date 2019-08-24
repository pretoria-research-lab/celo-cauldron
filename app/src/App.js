import React, {Component} from 'react';
import './App.css';
import QRCode from 'qrcode.react';
import loadingImg from './loading.svg';
import axios from 'axios';

const startingTimerSeconds = 30;
const extraTimeSeconds = 10;

const API_CONFIG = {
  baseUrl : "https://pag1tn4xfk.execute-api.eu-central-1.amazonaws.com", //"https://xsxgj1rqnc.execute-api.eu-central-1.amazonaws.com",
  basePath : "/prod/reward",  // "/dev/reward"
  timeout: 12000,
  headers: {"Content-Type":"application/json;charset=utf-8"}
}

const instance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
});

export default class App extends Component {

  constructor(props){
    super(props);
    this.state =  {   claimUrls: [],
                      currentUrl: {hashCode : "empty"},
                      currentUrlIndex: 0,
                      loading: true,
                      reloadTimer: startingTimerSeconds
                  };
  }

  getClaimUrls = async () => {
      const response = await instance.get(API_CONFIG.basePath); // no authorization on this endpoint
      console.log("Reward API - getAll() - success, response : " + JSON.stringify(response));
      return response.data.rewards;    
  }

  reloadClaimUrls = async () => {
    this.setState({loading:true}, async () => {

      const claimUrls = await this.getClaimUrls();

      if(claimUrls[claimUrls.length-1].hashCode !== (this.state.currentUrl.hashCode ? this.state.currentUrl.hashCode : "empty")){
        this.setState({claimUrls:claimUrls}, () => {
          this.setState({currentUrl: this.state.claimUrls[this.state.claimUrls.length - 1]}, () => {
            const currentUrlIndex = this.state.claimUrls.length;
            this.setState({currentUrlIndex}, () => {
              this.setState({loading:false});
            });          
          });        
        });
      }
      else{
        console.log('Result is not new, ignoring...');
        this.setState({loading:true});
      }
    });
  }

  componentDidMount = () =>{    
    this.reloadClaimUrls();
    setInterval(()=>{
      const reloadTimer =this.state.reloadTimer - 1;
      this.setState({reloadTimer}, async () => {
        if((reloadTimer===0)){
          await this.reloadClaimUrls();
          this.setState({reloadTimer:startingTimerSeconds});
        }
      });      
    }, 1000);
  }

  render = () => {
    return (
      <div className="App">
        <header className="Next Big Thing">          
          <div className="container-fluid">
            <h1>xDAIRow</h1>
            <hr />            
            {this.state.loading ? "" : <h2>You received {this.state.currentUrl.rewardInXDAI} xDAI</h2>}
          </div>          
        </header>
        <div id="main" className="container-fluid">        
          <div className="row">            
            <div className="column col-sm-12">                
                { this.state.loading ? 
                  <div className="waiting container-fluid">
                    <p>Waiting for result...</p>
                    <p>¯\_(ツ)_/¯</p>
                    <img alt="loading" className="loadingImg" src={loadingImg} /> 
                    <p>Checking for new result in {this.state.reloadTimer} seconds...</p>
                  </div>
                  :
                  <>                    
                    {this.state.currentUrl.rewardInXDAI > 0 ? 
                      <p>Scan this URL, claim your reward, and spend at our vending machine!</p>
                      :
                      <p>No reward for this attempt</p>
                    }
                    
                    <div className='qrCode'>                      
                      {this.state.currentUrl.claimUrl ? <QRCode size={384} bgColor="#000000" fgColor="#00FF33" includeMargin={false} value={this.state.currentUrl.claimUrl} />
                      : <h3>:(</h3>}
                    </div>                    

                    <div className="row">
                        <div className="column col-sm-12">
                          <table>
                            <thead className="dark-highlight-bg">
                              <tr>
                                <th>Measure</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.currentUrl.gameData ? 
                              <>
                              <tr>
                                <td>spm</td>
                                <td>{this.state.currentUrl.gameData["spm"]}</td>
                              </tr>
                              <tr>
                                <td>distance</td>
                                <td>{this.state.currentUrl.gameData["distance"]}</td>
                              </tr>
                              <tr>
                                <td>pace</td>
                                <td>{this.state.currentUrl.gameData["pace"]}</td>
                              </tr>
                              <tr>
                                <td>calhr</td>
                                <td>{this.state.currentUrl.gameData["calhr"]}</td>
                              </tr>
                              <tr>
                                <td>time</td>
                                <td>{this.state.currentUrl.gameData["time"]}</td>
                              </tr>
                              <tr>
                                <td>power</td>
                                <td>{this.state.currentUrl.gameData["power"]}</td>
                              </tr>
                              <tr>
                                <td>status</td>
                                <td>{this.state.currentUrl.gameData["status"]}</td>
                              </tr>
                              </> : ""}
                              <tr>
                                <td>timestamp</td>
                                <td>{this.state.currentUrl.createdTimestamp}</td>
                              </tr>
                              <tr>
                                <td>hash</td>
                                <td>{this.state.currentUrl.hashCode.substring(0,12)}</td>
                              </tr>                            
                            </tbody>                          
                          </table>
                        </div>  
                      </div>                    

                      <p>Disappearing in {this.state.reloadTimer} seconds...</p>
                    
                    {/* <button className="btn-primary" onClick={(event)=>{
                      event.preventDefault();
                      if(this.state.currentUrlIndex!==0){
                        const currentUrlIndex = this.state.currentUrlIndex -1;
                        const currentUrl = this.state.claimUrls[currentUrlIndex];
                        this.setState({currentUrl},()=>this.setState({currentUrlIndex}));  
                      }
                    }}>Show previous...</button> */}
                    
                    <button className="btn-primary" onClick={(event)=>{
                      event.preventDefault(); 
                      const addToTimer = this.state.reloadTimer + extraTimeSeconds; 
                      this.setState({reloadTimer:addToTimer});
                    }}>Wait!</button>
                  </>
                }              
            </div>
          </div> {/* row */}
        </div> {/* main- */}
      </div> 
    );
  }
}
