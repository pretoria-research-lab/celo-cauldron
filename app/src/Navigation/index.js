import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import logo from '../assets/Celo Logo Package/Monochrome Logo/Celo Logo Monochrome.svg';
import './navigation.css';

class Navigation extends Component 
{
  render() { 

    const { faucets } = this.props;
       
    return (<nav className="navbar navbar-expand-lg navbar-light static-top">
    <div className="container-fluid">
      
      <a className="navbar-brand" href="/">
        <img alt="Celo Monochrome Logo" src={logo} />
      </a>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarResponsive">
        
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <NavLink className="nav-link" to="/">Home</NavLink>
        </li>
        {faucets.map((faucet, i) => <li key={i} className="nav-item"><NavLink key={i} className="nav-link" to={"/" + faucet.toLowerCase() + "-faucet"}>{faucet + " Faucet"}</NavLink></li> )}

        </ul>
      </div>

    </div>
    </nav>)
  }
}

export default withRouter(Navigation);