import React from "react";
import PropTypes from "prop-types";
import "../SignedBlocks/signed-blocks-row.css";
import favouriteIcon from "../assets/favorite_white.svg";

AttestationMapRow.propTypes = () => { 
	return { 
		data: PropTypes.any,
		lookback: PropTypes.any,
		loading: PropTypes.bool,
		toggleFavourite: PropTypes.func
	}; 
};

export default function AttestationMapRow(props) {

	const { data, lookback, loading, toggleFavourite } = props;

	let filler = [];
	for(let i=0;i<(lookback-data.attestations.length);i++){
		filler.push({});
	}

	return (
		<>
			{loading ? <></> :
				<tr>
					<td onClick={() => toggleFavourite(data.key)} className={"favourite-" + (data.favourite ? "on" :"off")}>
						<img id="favouriteIcon" src={favouriteIcon} alt="Click to favourite this row" />
					</td>
					
					<td className="blockMapInfo text-align-left">
						<a rel="noopener noreferrer" target="_blank" href={data.issuerLink}>
							{data.issuerName ? data.issuerName : data.key}
						</a>
					</td>

					<td className="blockMapInfo text-align-left">
						<a rel="noopener noreferrer" target="_blank" href={data.attestationURL}>{data.attestationURL}</a>
					</td>

					<td title={JSON.stringify(data.attestationStatus)} className="blockMapInfo text-align-left">
						<a rel="noopener noreferrer" target="_blank" href={data.attestationURL + "/status"}>{data.attestationStatus.version + " " + data.attestationStatus.status}</a>
					</td>

					{data.attestations.map((t, i) => 
						<td 
							title={JSON.stringify(t)} 
							className={"attestation-" + lookback + " " + (t.completed.txId ? "completed" : "incomplete")} 
							key={i}
						>
							{/* <a rel="noopener noreferrer" target="_blank" href={t.issuerSelectedLink}>&nbsp;</a> */}
							{/* {t.completed.txId != null ? "✓" : "✘"} */}
							
						</td>)
					}

					{filler.map((t, i) => 
						<td 
							title={JSON.stringify(t)} 
							className={"attestation-" + lookback + " filler"} 
							key={i}
						>
							{/* &nbsp; */}
						</td>)
					}	
			
					<td className="signedNumber blockMapInfo">{data.selectedCount}</td>
					<td className="signedNumber blockMapInfo">{data.completedCount}</td>
					<td className="signedNumber blockMapInfo">{data.notCompletedCount}</td>
					<td className="signedNumber blockMapInfo">{data.completedRatio}</td>

				</tr>
			}
		</>
	);
}