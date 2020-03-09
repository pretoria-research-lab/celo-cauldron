import React from 'react';
import checkMark from '../assets/10-Check (light-bg).png';
import "./faucetqueuerow.css";

export default function FaucetQueueRow(props) {

	const { faucetRequest, onClick } = props;

	faucetRequest["txIdShort"] = faucetRequest.txId ? faucetRequest.txId.substr(0,10) + "..." + faucetRequest.txId.substr(faucetRequest.txId.length-10,10) : "";

	return (
		<tr>
			<td className="address"><a href={faucetRequest.addressLink}>{faucetRequest.address}</a></td>
			<td>{faucetRequest.createdBlockNumber}</td>
			<td>{faucetRequest.status}</td>
			<td>{faucetRequest.claimedBlockNumber}</td>
			<td className="address">{faucetRequest.status === "REQUESTED" ? "Not yet claimed" : <a href={faucetRequest.txLink}>{faucetRequest.txIdShort}</a>}</td>
			<td>{faucetRequest.status === "REQUESTED" ? <button onClick={() => onClick(faucetRequest)}>Claim</button> : <img id="checkmark" src={checkMark} alt="Claimed check mark" />}</td>
		</tr>			
	);
}