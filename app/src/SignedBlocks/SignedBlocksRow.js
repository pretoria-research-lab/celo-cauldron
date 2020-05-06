import React from "react";
import PropTypes from "prop-types";
import "./signed-blocks-row.css";

SignedBlocksRow.propTypes = () => { 
	return { 
		signedBlocksRow: PropTypes.any
	}; 
};	

export default function SignedBlocksRow(props) {

	const { signedBlocksRow } = props;

	return (
		<tr>
			<td className="address blockMapInfo text-align-left">
				<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.validatorLink}>
					{signedBlocksRow.validatorName ? signedBlocksRow.validatorName : signedBlocksRow.validatorAddress}
				</a>
			</td>
			<td className="address blockMapInfo">
				<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.signerLink}>{signedBlocksRow.signer}</a>
			</td>
			{signedBlocksRow.tickArray.map((t, i) => <td className={"signature " + (t === "." ? "signed" : t === "✘" ? "missed" : "other")} key={i}>{t}</td>)}
			<td className="blockMapInfo">{signedBlocksRow.counts.signatures}</td>
			<td className="blockMapInfo">{signedBlocksRow.counts.missedSignatures}</td>
			{/* <td className="blockMapInfo">{signedBlocksRow.counts.notASigner}</td>			 */}
		</tr>
	);
}