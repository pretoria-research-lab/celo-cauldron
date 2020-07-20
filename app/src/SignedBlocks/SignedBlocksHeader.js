import React, {useState} from "react";
import PropTypes from "prop-types";
import doersLogo from "../assets/04-Doers (dark bg).png";
import Slider from "rc-slider";
import RefreshSwitch from "./RefreshSwitch";
import OnlyFavouritesSwitch from "./OnlyFavouritesSwitch";
import "rc-slider/assets/index.css";

SignedBlocksHeader.propTypes = () => { 
	return { 
		network: PropTypes.any,
		jumpToBlock: PropTypes.func,
		atBlock: PropTypes.any,
		blockNumber: PropTypes.any,
		highwatermark: PropTypes.any,

		setStayAtHead: PropTypes.func,
		stayAtHead: PropTypes.bool,
		setOnlyFavourites: PropTypes.func,
		onlyFavourites: PropTypes.bool,

		scale: PropTypes.any
	}; 
};	

const getIndexFromValue = (value) => {
	var index = 0;
	var intValue = parseInt(value); 
	switch (intValue) {
	case 100:
		index = 0;
		break;
	case 200:
		index = 1;
		break;
	case 300:
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
	label: <strong>100</strong>
	},
	1:	{	style: {
		color: "var(--celo-green)",},
	label: <strong>200</strong>
	},
	2:	{	style: {
		color: "var(--celo-green)",},
	label: <strong>300</strong>
	},
};	


export default function SignedBlocksHeader(props) {

	const [atBlock, setAtBlock] = useState(0);
	const title = props.network.toLowerCase() === "mainnet" ? "" : (props.network + " ");
	const index = getIndexFromValue(props.scale);

	return (
		<>
			<div className="row headerRow centered">
				<div className="col-sm-5">
					<div className="row page-header">
						<img className="celoIcons" src={doersLogo} alt="Developer's icon" /> 
						<h2 className="mt">{"Celo " + title + "Signed Blocks Map"}</h2>
					</div>
				</div>
				<div className="col-sm-7">
					<div className="row controls">
						<div className="col-sm-3">			
							<table className="table table-dark table-bordered">
								<tbody>
									<tr><td>Forno</td><td>{props.blockNumber ? props.blockNumber : "loading..."}</td></tr>
									<tr><td>Cauldron</td><td>{props.highwatermark.atBlock ? props.highwatermark.atBlock : "loading..."}</td></tr>
								</tbody>
							</table>
						</div>
						<div className="col-sm-1">			
							<p>{"Epoch " + (props.epochNumber ? props.epochNumber : "loading...")}</p>
						</div>					
						<div className="col-sm-2">			
							<RefreshSwitch setStayAtHead={props.setStayAtHead} stayAtHead={props.stayAtHead}/>
						</div>
						<div className="col-sm-2">			
							<OnlyFavouritesSwitch setOnlyFavourites={props.setOnlyFavourites} onlyFavourites={props.onlyFavourites}/>
						</div>				
						<div className="col-sm-2">					
							<div className="column">
								<input defaultValue={0} onChange={(event, type)=>{
									event.preventDefault();
									event.persist();
									setAtBlock(event.target.value);
								}} name="jumpToBlock" className="form-control" id="jumpToBlock" type="text"></input>
								<button onClick={()=> props.jumpToBlock(atBlock)} className="btn-secondary">To block</button>
							</div>
						</div>
						<div className="col-sm-2">
							<p>Map Scale</p>
							<Slider min={0} max={2} step={1} defaultValue={index} marks={marks} onAfterChange={(value) => props.changeMapScale(value)}/>
						</div>
					</div>					
				</div>
			</div>	
		</> 
	);
}