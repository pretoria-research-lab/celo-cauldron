import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import pretoriaLogo from "../assets/Pretoria_Logo_black.png";
import "./navigation.css";

class Navigation extends Component 
{
	static get propTypes() { 
		return { 
			faucets: PropTypes.any,
			signedBlocks: PropTypes.any
		}; 
	}

	render() { 

		const { faucets, signedBlocks } = this.props;
       
		return (<nav className="navbar navbar-expand-lg navbar-light static-top">
			<div className="container-fluid">
      
				<a className="navbar-brand" href="/">	
					<img className="header-logo" alt="Pretoria Monochrome Logo" src={pretoriaLogo} />
				</a>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarResponsive">
        
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<NavLink className="nav-link" to="/">Tools</NavLink>
						</li>
						{signedBlocks.map((sb, i) => <li key={i} className="nav-item"><NavLink key={i} className="nav-link" to={"/" + (sb.toLowerCase() === "mainnet" ? "" : (sb.toLowerCase() + "-")) + "block-map"}>{(sb.toLowerCase() === "mainnet" ? "" : (sb + " ")) + "Block Map"}</NavLink></li> )}
						{faucets.map((faucet, i) => <li key={i} className="nav-item"><NavLink key={i} className="nav-link" to={"/" + faucet.toLowerCase() + "-faucet"}>{faucet + " Faucet"}</NavLink></li> )}
					</ul>
				</div>

			</div>
		</nav>);
	}
}

export default withRouter(Navigation);