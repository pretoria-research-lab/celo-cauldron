import React from "react";
import PropTypes from "prop-types";
import checkMark from "../assets/10-Check (light-bg).png";
import "./faucetqueuerow.css";

FaucetQueueRow.propTypes = () => { 
	return { 
		faucetRequest: PropTypes.any,
		blockNumber: PropTypes.any,
		config: PropTypes.any,
		onClick: PropTypes.func
	}; 
};	

export default function FaucetQueueRow(props) {

	const { faucetRequest, blockNumber, config, onClick } = props;

	faucetRequest["txIdShort"] = faucetRequest.txId ? faucetRequest.txId.substr(0,10) + "..." + faucetRequest.txId.substr(faucetRequest.txId.length-10,10) : "";
	const blocksUntilReady = config.blocksCooldown - (blockNumber - faucetRequest.createdBlockNumber) < 0 ? 0 : config.blocksCooldown - (blockNumber - faucetRequest.createdBlockNumber);
	const isComplete = faucetRequest.txId;

	return (
		<tr>
			<td className="address"><a href={faucetRequest.addressLink}>{faucetRequest.address}</a></td>
			<td>{faucetRequest.createdBlockNumber}</td>
			<td>{faucetRequest.status}</td>
			{	(blocksUntilReady > 0) && (!isComplete) ?
				<td colSpan="3">{"Cooling down, ready in " + blocksUntilReady + " blocks"}</td>
				:
				<>
					{ 	(!isComplete) ? 
						<>
							<td colSpan="2">Ready to claim</td>
							<td><button onClick={() => onClick(faucetRequest)}>Confirm</button></td>
						</>
						:
						<>
							<td>{faucetRequest.claimedBlockNumber}</td>
							<td className="address"><a href={faucetRequest.txLink}>{faucetRequest.txIdShort}</a></td>
							<td><img id="checkmark" src={checkMark} alt="Claimed check mark" /></td>
						</>
					}
				</>
			}
		</tr>			
	);
}