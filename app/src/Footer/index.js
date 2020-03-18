import React from "react";
import "./footer.css";

export default function Footer() {
    
	return (    
		<footer className="footer jost">     
			<div className="container-fluid text-center text-sm-left">
				<div className="row">
					<div className="col-sm-6">
						<p>Built by <a href="https:/pretoria.tech">Pretoria Research Lab GmbH</a></p>
						<p>We are a DeFi and staking protocol start-up founded in February 2020 in Berlin, Germany by <a href="https://www.nextbigthing.ag/">Next Big Thing</a> 
							, choosing to support the <a href="https://celo.org">Celo Protocol</a> with tooling and validating.</p>
					</div>
					<div className="col-sm-6">
						<p>Built with <a href="https://reactjs.org/">React JS</a> and <a href="https://serverless.com/">Serverless Framework</a>. 
						Help us improve this page - contribute at <a href="https://gitlab.com/pretoria-research-lab/celo-cauldron">https://gitlab.com/pretoria-research-lab/celo-cauldron</a></p>
					</div>      
				</div>
			</div>
		</footer>    
	);
}