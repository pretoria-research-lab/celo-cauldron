import React, {Component} from 'react';
import './App.css';
import QRCode from 'qrcode.react';
import loadingImg from './loading.svg';
import axios from 'axios';

const API_CONFIG = {
  baseUrl : "https://xsxgj1rqnc.execute-api.eu-central-1.amazonaws.com",
  basePath : "/dev/reward",
  timeout: 6000,
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
                      currentUrl: "",
                      currentUrlIndex: 0,
                      loading: true,
                      reloadTimer: 30
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
      this.setState({claimUrls}, () => {
        this.setState({currentUrl: this.state.claimUrls[this.state.claimUrls.length - 1]}, () => {
          const currentUrlIndex = this.state.claimUrls.length;
          this.setState({currentUrlIndex}, () => {
            this.setState({loading:false});
          });          
        });        
      });
    });
  }

  componentDidMount = () =>{    
    this.reloadClaimUrls();
    setInterval(()=>{
      const reloadTimer =this.state.reloadTimer - 1;
      this.setState({reloadTimer}, async () => {
        if(reloadTimer===0){
          await this.reloadClaimUrls();
          this.setState({reloadTimer:10});
        }
      });      
    }, 1000);
  }

  render = () => {
    return (
      <div className="App">
        <header className="Next Big Thing">          
          <h1>xDAIRow</h1>
          <hr/>
        </header>
        <div id="main" className="container">        
          <div className="row">            
            <div className="column col-sm-12">                
                { this.state.loading ? 
                  <>
                    <h2>Loading...</h2>
                    <div>
                      <img alt="loading" className="loadingImg" src={loadingImg} /> 
                    </div>
                  </>
                  :
                  <>                    
                    <p>Scan this URL and go straight to a browser burner wallet for use in our vending machine!</p>
                    
                    <div className='qrCode'>
                      {this.state.currentUrl.claimUrl ? <QRCode size={256} bgColor="#000000" fgColor="#00FF33" includeMargin={true} value={this.state.currentUrl.claimUrl} />
                      : <h3>:(</h3>}
                    </div>

                    <p><strong>You received {this.state.currentUrl.rewardInXDAI} xDAI</strong></p>
                    <p>{"Attempt : " + this.state.currentUrlIndex}</p>
                    <p>{"Timestamp : " + this.state.currentUrl.createdTimestamp}</p>
                    <p>{"Hash (truncated) : " + this.state.currentUrl.hashCode.substring(0,12)}</p>
                    <p>Refreshing in {this.state.reloadTimer} seconds...</p>
                    
                    <button className="btn-primary" onClick={(event)=>{
                      event.preventDefault();
                      if(this.state.currentUrlIndex!==0){
                        const currentUrlIndex = this.state.currentUrlIndex -1;
                        const currentUrl = this.state.claimUrls[currentUrlIndex];
                        this.setState({currentUrl},()=>this.setState({currentUrlIndex}));  
                      }
                    }}>Show previous...</button>
                    
                    <button className="btn-primary" onClick={(event)=>{
                      event.preventDefault(); 
                      const addToTimer = this.state.reloadTimer + 10; 
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
