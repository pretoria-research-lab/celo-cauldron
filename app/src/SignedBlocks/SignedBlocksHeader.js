import React, { useState } from "react";
import PropTypes from "prop-types";
import doersLogo from "../assets/04-Doers (light bg).png";

SignedBlocksHeader.propTypes = () => { 
	return { 
		network: PropTypes.any,
		jumpToBlock: PropTypes.func,
		atBlock: PropTypes.any,
		blockNumber: PropTypes.any
	}; 
};	

export default function SignedBlocksHeader(props) {

	const [atBlock, setAtBlock] = useState(0);

	return (
		<>
			<div className="column centered">
				<div className="row page-header">
					<img className="celoIcons" src={doersLogo} alt="Developer's icon" /> 
					<h1 className="mt">{props.network + " Signed Blocks Map"}</h1>
				</div>
				<div className="row">
					<h4>{"A visual map of validator signatures for the " + props.network + " network"}</h4>
				</div>

				<div className="row jump">
					<div className="col-sm-4">			
						<p>{"Current block " + props.blockNumber}</p>
					</div>					
					<div className="col-sm-4">					
						<input defaultValue={props.atBlock} onChange={(event, type)=>{
							event.preventDefault();
							event.persist();
							setAtBlock(event.target.value);
						}} name="jumpToBlock" className="form-control" id="jumpToBlock" type="text"></input>
					</div>
					<div className="col-sm-4">
						<button onClick={()=> props.jumpToBlock(atBlock)} className="btn-secondary">Jump to block</button>
					</div>
				</div>					
			</div>
			
		</> 
	);
}