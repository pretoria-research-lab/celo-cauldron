import React, { useState } from 'react';
import * as web3Utils from 'web3-utils';

const isValid = (address) => {
    return web3Utils.isAddress(address);
}

export default function EmptyFaucetQueueRow(props) {

	const [ address, setAddress] = useState("0x0000000000000000000000000000000000000000");

	const { onClick } = props;	

	return (
		<tr>			
			<td><input name="address" onChange={(event,type) => setAddress(event.target.value)} className="form-control address" value={address} id="address" type="text"></input></td>
			<td></td>
			<td>NEW</td>
			<td></td>
			<td>¯\_(ツ)_/¯</td>
			<td><button disabled={!isValid(address)} onClick={() => onClick(address)}>{isValid(address) ? "Request" : "Invalid Address"}</button></td>
		</tr>			
	);
}