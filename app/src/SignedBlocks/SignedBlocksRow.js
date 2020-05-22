import React from "react";
import PropTypes from "prop-types";
import "./signed-blocks-row.css";
import favouriteIcon from "../assets/favorite.svg";

SignedBlocksRow.propTypes = () => { 
	return { 
		signedBlocksRow: PropTypes.any,
		lookback: PropTypes.any,
		loading: PropTypes.bool,
		toggleFavourite: PropTypes.func
	}; 
};

export default function SignedBlocksRow(props) {

	const { signedBlocksRow, lookback, loading, toggleFavourite } = props;

	return (
		<>
		{loading ? <></> :
		<tr>
			<td onClick={() => toggleFavourite(signedBlocksRow.signer)} className={"favourite-" + (signedBlocksRow.favourite ? "on" :"off")}>
				<img id="favouriteIcon" src={favouriteIcon} alt="Click to favourite this row" />
			</td>
			<td className="address blockMapInfo text-align-left">
				<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.validatorLink}>
					{signedBlocksRow.validatorName ? signedBlocksRow.validatorName : signedBlocksRow.validatorAddress}
				</a>
			</td>
			<td className="address blockMapInfo">
				<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.signerLink}>{signedBlocksRow.signer}</a>
			</td>

			{signedBlocksRow.tickArray.map((t, i) => <td className={"signature-" + lookback + " " + (t === "." ? "signed" : t === "✘" ? "missed" : "other")} key={i}>{}</td>)}

			{/* {lookback === 100 ?
				(signedBlocksRow.tickArray.map((t, i) => <td className={"signature-" + lookback + " " + (t === "." ? "signed" : t === "✘" ? "missed" : "other")} key={i}>{}</td>))
				:
				(signedBlocksRow.signedArray.map((t, i) => <td className={"large-scale signature " + (t >= 88 ? "signed" : "missed")} key={i}>{t}</td>))		
			}													 */}
			
			<td className="blockMapInfo">{signedBlocksRow.counts.signatures}</td>
			<td className="blockMapInfo">{signedBlocksRow.counts.missedSignatures}</td>
			{/* <td className="blockMapInfo">{signedBlocksRow.counts.notASigner}</td>			 */}
		</tr>
		}
		</>
	);
}