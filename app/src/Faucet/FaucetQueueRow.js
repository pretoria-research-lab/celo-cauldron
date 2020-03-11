import React from 'react';
import checkMark from '../assets/10-Check (light-bg).png';
import "./faucetqueuerow.css";

export default function FaucetQueueRow(props) {

	const { faucetRequest, blockNumber, config } = props;

	faucetRequest["txIdShort"] = faucetRequest.txId ? faucetRequest.txId.substr(0,10) + "..." + faucetRequest.txId.substr(faucetRequest.txId.length-10,10) : "";
	const blocksUntilReady = config.blocksCooldown - (blockNumber - faucetRequest.createdBlockNumber) < 0 ? 0 : config.blocksCooldown - (blockNumber - faucetRequest.createdBlockNumber);
	const isComplete = faucetRequest.claimedBlockNumber > 0;

	return (
		<tr>
			<td className="address"><a href={faucetRequest.addressLink}>{faucetRequest.address}</a></td>
			<td>{faucetRequest.createdBlockNumber}</td>
			<td>{faucetRequest.status}</td>
			{	!isComplete ?
				<td colSpan="3">{"Cooling down, ready in " + blocksUntilReady + " blocks"}</td>
				:
				<>
				<td>{faucetRequest.claimedBlockNumber}</td>
				<td className="address"><a href={faucetRequest.txLink}>{faucetRequest.txIdShort}</a></td>
				<td><img id="checkmark" src={checkMark} alt="Claimed check mark" /></td>
				</>
			}
		</tr>			
	);
}