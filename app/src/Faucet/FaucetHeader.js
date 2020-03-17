import React from "react";
import PropTypes from "prop-types";
import developerLogo from "../assets/01-Developers (light bg).png";
import Jumbotron from "react-bootstrap/Jumbotron";

FaucetHeader.propTypes = () => { 
	return { 
		network: PropTypes.any
	}; 
};	

export default function FaucetHeader(props) {

	return (
		<div className="row">
			<div className="col-lg-12 text-center jumbo-primary">
				<Jumbotron fluid>
					<h1 className="mt"><img id="developer-logo" src={developerLogo} alt="Developer logo" />{props.network + " Community Faucet"}</h1>
				</Jumbotron>
			</div>
		</div>
	);
}