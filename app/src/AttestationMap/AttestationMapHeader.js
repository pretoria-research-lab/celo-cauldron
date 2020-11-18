import React from "react";
import PropTypes from "prop-types";
import securityCheckLogo from "../assets/11-Security Check (dark-bg).png";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import RefreshSwitch from "../Common/RefreshSwitch";
import OnlyFavouritesSwitch from "../Common/OnlyFavouritesSwitch";

AttestationMapHeader.propTypes = () => { 
	return { 
		network: PropTypes.any,
		blockNumber: PropTypes.any,
		setAutoRefresh: PropTypes.func,
		autoRefresh: PropTypes.bool,
		setOnlyFavourites: PropTypes.func,
		onlyFavourites: PropTypes.bool,
		scale: PropTypes.any,
		atBlock: PropTypes.any
	}; 
};	

const getIndexFromValue = (value) => {
	var index = 0;
	var intValue = parseInt(value); 
	switch (intValue) {
	case 150:
		index = 0;
		break;
	case 200:
		index = 1;
		break;
	case 250:
		index = 2;
		break;
	default:
		index = 0;
	}
	return index;
};

const marks = 
{ 
	0:	{	style: {
		color: "var(--celo-green)",},
	label: <strong>150</strong>
	},
	1:	{	style: {
		color: "var(--celo-green)",},
	label: <strong>200</strong>
	},
	2:	{	style: {
		color: "var(--celo-green)",},
	label: <strong>250</strong>
	},
};

export default function AttestationMapHeader(props) {

	const title = props.network.toLowerCase() === "mainnet" ? "" : (props.network + " ");
	const index = getIndexFromValue(props.scale);

	return (
		<>
			<div className="row headerRow centered">
				<div className="col-sm-5">
					<div className="row page-header">
						<img className="celoIcons" src={securityCheckLogo} alt="Security check icon" /> 
						<h2 className="mt">{"Celo " + title + "Attestations Map"}</h2>
					</div>
				</div>
				<div className="col-sm-7">
					<div className="row controls">
						<div className="col-sm-3">			
							<table className="table table-dark table-bordered">
								<tbody>
									<tr><td>Current</td><td>{props.blockNumber ? props.blockNumber : "loading..."}</td></tr>
									{/* <tr><td>API data at</td><td>{props.atBlock ? props.atBlock : "loading..."}</td></tr> */}
								</tbody>
							</table>
						</div>
						<div className="col-sm-2">			
							<p>{"Epoch " + (props.epochNumber ? props.epochNumber : "loading...")}</p>
						</div>					
						<div className="col-sm-2">			
							<RefreshSwitch switchText={"Auto-refresh"} setStayAtHead={props.setAutoRefresh} stayAtHead={props.autoRefresh}/>
						</div>
						<div className="col-sm-2">			
							<OnlyFavouritesSwitch setOnlyFavourites={props.setOnlyFavourites} onlyFavourites={props.onlyFavourites}/>
						</div>				
						<div className="col-sm-3">
							<p>Map Scale</p>
							<Slider min={0} max={2} step={1} defaultValue={index} marks={marks} onAfterChange={(value) => props.changeMapScale(value)}/>
						</div>
					</div>					
				</div>
			</div>	
		</> 
	);
}