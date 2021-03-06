import React from "react";
import "./home.css";
import HomeInformation from "./HomeInformation";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import doersLogo from "../assets/04-Doers (dark bg).png";

export default function Home() {
	return (
		<div className="container-fluid">    
			<div className="column centered">
				<div className="row page-header">      
					<img className="celoIcons" src={doersLogo} alt="Doers icon" /> 
					<h2 className="mt">Celo Cauldron</h2>					
				</div>
				<div className="row">
					<h4>An independent community list of useful tools, scripts, and information for developing on the Celo ecosystem.</h4>
				</div>
			</div>
			<HomeInformation />
			<hr/>
		</div>
	);
}
