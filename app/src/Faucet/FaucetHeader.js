import React from "react";
import PropTypes from "prop-types";
import developerLogo from "../assets/01-Developers (light bg).png";

FaucetHeader.propTypes = () => { 
	return { 
		network: PropTypes.any
	}; 
};	

export default function FaucetHeader(props) {

	return (
		<div className="column centered">
			<div className="row page-header">       
				<img className="celoIcons" src={developerLogo} alt="Developer's icon" /> 
				<h1 className="mt">{props.network + " Faucet"}</h1>
				<hr/> 
			</div>
		</div>
	);
}