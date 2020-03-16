import React, { useState } from "react";
import PropTypes from "prop-types";
import * as web3Utils from "web3-utils";

const isValid = (address) => {
	return web3Utils.isAddress(address);
};

EmptyFaucetQueueRow.propTypes = () => { 
	return { 
		onClick: PropTypes.func
	}; 
};	

export default function EmptyFaucetQueueRow(props) {

	const [ address, setAddress] = useState("0x0000000000000000000000000000000000000000");
	const { onClick } = props;	

	return (
		<tr>			
			<td><input name="address" onChange={(event) => setAddress(event.target.value)} className="form-control address" value={address} id="address" type="text"></input></td>
			<td colSpan="4"><p>Enter a new faucet request here</p></td>
			<td><button disabled={!isValid(address)} onClick={() => onClick(address)}>{isValid(address) ? "Request" : "Invalid Address"}</button></td>
		</tr>			
	);
}