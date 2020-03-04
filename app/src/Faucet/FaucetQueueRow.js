import React from 'react';
import checkMark from '../assets/10-Check (light-bg).png';
import "./faucetqueuerow.css";

export default function FaucetQueueRow(props) {

	const { faucetRequest, onClick } = props;	

	return (
		<tr>
			<td><a href={faucetRequest.addressLink}>{faucetRequest.address}</a></td>
			<td>{faucetRequest.createdBlockNumber}</td>
			<td>{faucetRequest.status}</td>
			<td>{faucetRequest.claimedBlockNumber}</td>
			<td>{faucetRequest.status === "REQUESTED" ? "Not yet claimed" : <a href={faucetRequest.txLink}>{faucetRequest.txId}</a>}</td>
			<td>{faucetRequest.status === "REQUESTED" ? <button onClick={() => onClick(faucetRequest)}>Claim</button> : <img id="checkmark" src={checkMark} alt="Claimed check mark" />}</td>
		</tr>			
	);
}