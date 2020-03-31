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
		<>
			<div className="column centered">
				<div className="row page-header">
					<img className="celoIcons" src={developerLogo} alt="Developer's icon" /> 
					<h1 className="mt">{props.network + " Faucet"}</h1>
				</div>
				<div className="row">
					<h4>A community funded faucet to receive nominal amounts of cGLD for testing and development on the Celo Alfajores network</h4>
				</div>
			</div>
			<hr/>
		</> 
	);
}