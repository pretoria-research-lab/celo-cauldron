import React from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";

FaucetInformation.propTypes = () => { 
	return { 
		faucetBalance: PropTypes.any,
		blockNumber: PropTypes.any,
		config: PropTypes.any
	}; 
};	

export default function FaucetInformation(props) {

	return (
		<div className="row">
			<div className="col-lg-4">
				<h3>Faucet Address</h3>
				<hr />
				<p className="address">{props.config ? <a href={props.config.blockExplorer + "/address/" + props.config.faucetAddress}>{props.config.faucetAddress}</a> : ""}</p>
				<hr />
				<div className='qrCode'>                      
					{props.config.faucetAddress ? <QRCode size={150} bgColor="#FFFFFF" fgColor="#2E3338" includeMargin={false} value={props.config.faucetAddress} /> : "" }
				</div>
				<div className="technical">
					<p>{"Balance " + props.faucetBalance + " CELO"}</p>
					<p>{"Block number " + props.blockNumber}</p>
				</div>
			</div>
			<div id="how-to-prepare" className="col-lg-8">
				<h3>How To Prepare</h3>
				<hr />
				<ul>
					<li>Use the table below to request a 1 CELO for testing purposes</li>
					<li>The CELO will cool down for 12 blocks before being served</li>
					<li>Press the confirm button to claim your faucet amount after cooldown</li>
					<li>A maximum of 20 requests can be queued at once</li>                
					<li>If someone leaves without claiming, you may confirm for them at any time</li>
					<li>Only the last 20 requests are visible on this dashboard</li>
				</ul>
				<h5 className="nb">This is a community kitchen - please return any CELO if you are finished cooking</h5>
			</div>
		</div>
	);
}