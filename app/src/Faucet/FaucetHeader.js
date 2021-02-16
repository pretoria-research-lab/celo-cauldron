import React from "react";
import PropTypes from "prop-types";
import airdropIcon from "../assets/13-Airdrop Green Coin (dark bg).png";

FaucetHeader.propTypes = () => { 
	return { 
		network: PropTypes.any
	}; 
};	

export default function FaucetHeader(props) {

	return (
		<>
			<div className="row centered">
				<div className="col-sm-4">
					<div className="row page-header">
						<img className="celoIcons" src={airdropIcon} alt="Airdrop icon" /> 
						<h2 className="mt">{"Celo " + props.network + " Faucet"}</h2>
					</div>
				</div>
				<div className="col-sm-8">
					<div className="row">
						<p>{"A community funded faucet to receive nominal amounts of CELO for testing and development on the Celo " + props.network + " network"}</p>
					</div>
				</div>
			</div>
		</> 
	);
}