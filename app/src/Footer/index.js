import React from "react";
import PropTypes from "prop-types";
import "./footer.css";
import pretoriaLogo from "../assets/Pretoria_Logo_black.png";
import {validatorGroupLink, validatorGroup} from "../Utils/config";

Footer.propTypes = () => { 
	return { 
		faucets: PropTypes.any
	}; 
};

export default function Footer() {

	return (    
		<footer className="footer jost">     
			<div className="container-fluid text-sm-left">
				<div className="row">
					<div className="col-sm-3">
						<a className="navbar-brand" href="/">	
							<img className="header-logo" alt="Pretoria Monochrome Logo" src={pretoriaLogo} />
						</a>
					</div>
					<div className="col-sm-3">
						<p>Built by <a href="https://pretoriaresearchlab.io">Pretoria Research Lab GmbH</a></p>
						<p>We are a DeFi and staking protocol start-up founded in February 2020 in Berlin, Germany by <a href="https://www.nextbigthing.ag/">Next Big Thing</a> 
							, choosing to support the <a href="https://celo.org">Celo Protocol</a> with tooling and validating.</p>
					</div>
					<div className="col-sm-3">
						<p>If you find this page useful, please consider supporting Pretoria by voting for our Celo validator group:</p>
						<p><a href={validatorGroupLink}>{validatorGroup}</a></p>						
					</div>
					<div className="col-sm-3">
						<p>Built with <a href="https://reactjs.org/">React JS</a>, <a href="https://serverless.com/">Serverless Framework</a>, and <a href="https://docs.gitlab.com/ee/ci/">GitLab CI</a> 
						. Icons used with limited permission as per the <a href="https://celo.org/code-of-conduct">Celo Code of Conduct</a>. Best viewed on desktop.
						</p>
						<p>Help us improve this page. Contribute at <a href="https://gitlab.com/pretoria-research-lab/celo-cauldron">https://gitlab.com/pretoria-research-lab/celo-cauldron</a></p>
					</div>
				</div>
			</div>
		</footer>    
	);
}