import React from "react";
import PropTypes from "prop-types";
import "./footer.css";
import pretoriaLogo from "../assets/Pretoria_Logo_color_02.png";
import {validatorGroupLink, validatorGroup} from "../Utils/config";

import attestationMaven from "../assets/validator-badges/AttestationMaven.svg";
import genesisValidator from "../assets/validator-badges/GenesisValidator.svg";
import masterValidator from "../assets/validator-badges/MasterValidator.svg";
import voteRecipient from "../assets/validator-badges/VoteRecipient.svg";
import founderValidator from "../assets/validator-badges/FounderValidator.svg";

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
						<p><a className="navbar-brand" href="/"><img className="header-logo" alt="Pretoria Monochrome Logo" src={pretoriaLogo} /></a></p>
						<p>We are a DeFi and staking protocol start-up founded in February 2020 in Berlin, Germany by <a href="https://www.nextbigthing.ag/">Next Big Thing</a> 
							, choosing to support the <a href="https://celo.org">Celo Protocol</a> with tooling and validating.</p>						
					</div>

					<div className="col-sm-3">
						<p>Pretoria Research Lab is a founding validator of the Celo network, and was security audited 
							during <a href="https://forum.celo.org/t/the-great-celo-stake-off-the-details/136">The Great Celo Stake Off</a> and awarded the Master Validator badge.</p>
						<div className="row validatorBadges">
							<a href="https://github.com/celo-org/celo-monorepo/blob/master/packages/web/validator-badges/001-stake-off-founder-validator.md"><img src={founderValidator} alt="Founder Validator" /></a>
							<a href="https://github.com/celo-org/celo-monorepo/blob/master/packages/web/validator-badges/004-genesis-validator.md"><img src={genesisValidator} alt="Genesis Validator" /></a>
							<a href="https://github.com/celo-org/celo-monorepo/blob/master/packages/web/validator-badges/003-stake-off-master-validator.md"><img src={masterValidator} alt="Master Validator" /></a>						
							<a href="https://github.com/celo-org/celo-monorepo/blob/master/packages/web/validator-badges/007-celo-foundation-vote-recipient.md"><img src={voteRecipient} alt="Vote Recipient" /></a>
							<a href="https://github.com/celo-org/celo-monorepo/blob/master/packages/web/validator-badges/002-stake-off-attestation-maven.md"><img src={attestationMaven} alt="Attestation Maven" /></a>
						</div>						
					</div>

					<div className="col-sm-3">
						<p>If you find this page useful, please consider supporting Pretoria by voting for our Celo validator group:</p>
						<p><a href={validatorGroupLink}>{validatorGroup}</a></p>
						<p>Additional validator group information available at <a href="https://thecelo.com/group/pretoriaresearchlab">https://thecelo.com/group/pretoriaresearchlab</a></p>
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