import React from "react";
import "./home.css";
import HomeInformation from "./HomeInformation";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import doersLogo from "../assets/04-Doers (light bg).png";

export default function Home() {
	return (
		<div className="container-fluid">    
			<div className="row">
				<div className="col-lg-12 text-center">         
					<img className="celoIcons" src={doersLogo} alt="Doers icon" /> 
					<h1 className="mt">Celo Cauldron</h1>
					<hr/> 
				</div>
			</div>
			<div className="row">
				<div className="jost col-lg-12">
					<h3>A repository of useful tools, scripts, and information for developing on the Celo ecosystem.</h3>
				</div>
			</div>
			<div className="row">
				<HomeInformation />
			</div>
		</div>
	);
}
