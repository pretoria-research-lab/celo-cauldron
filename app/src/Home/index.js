import React from 'react';
import {Jumbotron} from 'react-bootstrap';
import './home.css';
import HomeInformation from './HomeInformation';
import developerLogo from '../assets/01-Developers (light bg).png'

export default function Home() {
  return ( 

  <div className="container-fluid">    
    <div className="row">
      <div className="col-lg-12 text-center jumbo-primary">
        <Jumbotron>          
          <h1 className="mt">Celo Cauldron</h1>
          < hr/>
          <p className="lead"><img id="developer-logo" src={developerLogo} alt="Developer logo" />Community built tools for developers</p>
          < hr/>          
        </Jumbotron>
        <HomeInformation />
      </div>
    </div>
  </div>
  );
}
