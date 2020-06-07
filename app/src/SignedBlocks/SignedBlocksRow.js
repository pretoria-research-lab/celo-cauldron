import React from "react";
import PropTypes from "prop-types";
import "./signed-blocks-row.css";
import favouriteIcon from "../assets/favorite.svg";

SignedBlocksRow.propTypes = () => { 
	return { 
		signedBlocksRow: PropTypes.any,
		lookback: PropTypes.any,
		loading: PropTypes.bool,
		toggleFavourite: PropTypes.func,
		atBlock: PropTypes.any
	}; 
};

export default function SignedBlocksRow(props) {

	const { signedBlocksRow, lookback, loading, toggleFavourite, atBlock } = props;

	return (
		<>
			{loading ? <></> :
				<tr>
					<td onClick={() => toggleFavourite(signedBlocksRow.signer)} className={"favourite-" + (signedBlocksRow.favourite ? "on" :"off")}>
						<img id="favouriteIcon" src={favouriteIcon} alt="Click to favourite this row" />
					</td>
					<td className="blockMapInfo text-align-left">
						<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.validatorLink}>
							{signedBlocksRow.validatorName ? signedBlocksRow.validatorName : signedBlocksRow.validatorAddress}
						</a>
					</td>
					<td className="blockMapInfo">
						<a rel="noopener noreferrer" target="_blank" href={signedBlocksRow.signerLink}>{signedBlocksRow.signer}</a>
					</td>

					{signedBlocksRow.tickArray.map((t, i) => 
						<td 
							title={"Signer " + signedBlocksRow.signer + ", block " + (atBlock - (+lookback) + i + 1) + " (" + t + ")"} 
							className={"signature-" + lookback + " " + (t === "." ? "signed" : t === "✘" ? "missed" : "other")} 
							key={i}>
							{}
						</td>)}
			
					<td className="signedNumber blockMapInfo">{signedBlocksRow.counts.signatures}</td>
					<td className="missedNumber blockMapInfo">{signedBlocksRow.counts.missedSignatures}</td>

				</tr>
			}
		</>
	);
}