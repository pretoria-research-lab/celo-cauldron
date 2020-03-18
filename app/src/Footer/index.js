import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./footer.css";

Footer.propTypes = () => { 
	return { 
		faucets: PropTypes.any
	}; 
};

export default function Footer(props) {

	const {faucets} = props;
    
	return (    
		<footer className="footer jost">     
			<div className="container-fluid text-sm-left">
				<div className="row">
					<div className="col-sm-3">
						<p>Built by <a href="https://cauldron.pretoria.tech">Pretoria Research Lab GmbH</a></p>
						<p>We are a DeFi and staking protocol start-up founded in February 2020 in Berlin, Germany by <a href="https://www.nextbigthing.ag/">Next Big Thing</a> 
							, choosing to support the <a href="https://celo.org">Celo Protocol</a> with tooling and validating.</p>
					</div>
					<div className="col-sm-3">
						<p>Built with <a href="https://reactjs.org/">React JS</a>, <a href="https://serverless.com/">Serverless Framework</a>, and <a href="https://docs.gitlab.com/ee/ci/">GitLab CI</a> 
						. Icons used with limited permission as per the <a href="https://celo.org/code-of-conduct">Celo Code of Conduct.</a>
						</p>
						<p>Help us improve this page. Contribute at <a href="https://gitlab.com/pretoria-research-lab/celo-cauldron">https://gitlab.com/pretoria-research-lab/celo-cauldron</a></p>
					</div>
					<div className="col-sm-2">
						<NavLink className="nav-link" to="/">Tools</NavLink>
						{faucets.map((faucet, i) => <NavLink key={i} className="nav-link" to={"/" + faucet.toLowerCase() + "-faucet"}>{faucet + " Faucet"}</NavLink> )}
					</div>
				</div>
			</div>
		</footer>    
	);
}