import React from "react";
import "./footer.css";

export default function Footer() {
    
	return (
    
		<footer className="footer">     
			<div className="container-fluid text-center text-sm-left">
				<div className="row">
					<div className="col-sm-6">
						<p>Built by <a href="https:/pretoria.tech">Pretoria Research Lab GmbH</a></p>
					</div>
					<div className="col-sm-6">
						<p>Contribute to this codebase at <a href="https://gitlab.com/pretoria-research-lab/celo-cauldron">https://gitlab.com/pretoria-research-lab/celo-cauldron</a></p>
					</div>               
				</div>
			</div>
		</footer>
    
	);
}
