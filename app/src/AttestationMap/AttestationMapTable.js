import React from "react";
import PropTypes from "prop-types";
import AttestationMapRow from "./AttestationMapRow";
import loadingImg from "../assets/loading.svg";
import favouriteIcon from "../assets/favorite_black.svg";
import "../SignedBlocks/signed-blocks-table.css";

AttestationMapTable.propTypes = () => { 
	return { 
		attestations: PropTypes.any,
		loading: PropTypes.bool,
		blockNumber: PropTypes.any,
		lookback: PropTypes.any,
		atBlock: PropTypes.any,
		toggleFavourite: PropTypes.func,
		sortByAttributeName: PropTypes.string,
		sortByAttribute: PropTypes.func,
		sortIcon: PropTypes.any
	}; 
};

export default function AttestationMapTable(props) {

	const {attestations, loading, blockNumber, atBlock, lookback, toggleFavourite, sortByAttributeName, sortByAttribute, sortIcon} = props;
	const colSpan = lookback;
	const favourites = attestations.filter((e,i) => e.favourite === true);
	const nonFavourites = attestations.filter((e,i) => e.favourite === false);

	const headers = [
		{	label: "Validator",
			attributeName: "issuerName",
			altText: "Sorted by validator name"
		},
		{	label: "Attestation URL",
			attributeName: "attestationURL",
			altText: "Sorted by attestation URL"
		},
		{	label: "Status",
			attributeName: "status",
			altText: "Sorted by status"
		}		
	];

	const summaries = [
		{	label: "Σ",
			attributeName: "selectedCount",
			altText: "Sorted by number of attestations selected"
		},
		{	label: "✓",
			attributeName: "completedCount",
			altText: "Sorted by number of completed attestations"
		},
		{	label: "✘",
			attributeName: "notCompletedCount",
			altText: "Sorted by number of attestations not completed"
		},
		{	label: "%",
			attributeName: "completedRatio",
			altText: "Sorted by ratio of attestations completed"
		}		
	]

	return (
		<div className="row">
			<div className="col-lg-12 text-center">
				{ loading || blockNumber === -1 ? 
					<img id="loadingLogo" src={loadingImg} alt="Loading..." />
					:
					<div className="table-responsive">
						<table className="signed-blocks table table-dark table-bordered table-hover">
							<thead>
								<tr>
									<th><img id="favouriteIconTableHeader" src={favouriteIcon} alt="Favourite this row" /></th>

									{headers.map((value, i) => 
										<th key={i} onClick={() => {
											if(sortByAttributeName === value.attributeName)
												sortByAttribute(attestations, value.attributeName, true);
											else
												sortByAttribute(attestations, value.attributeName, false);
										}}>
											<>
												<span>{value.label + "     "}</span>										
												{sortByAttributeName===value.attributeName ? <img id="sortIcon" src={sortIcon} alt={value.altText} /> : ""}
											</>
										</th>
									)}
									
									<th colSpan={colSpan}>{"Attestations"}</th>	

									{summaries.map((value, i) => 
										<th key= {i} onClick={() => {
											if(sortByAttributeName === value.attributeName)
												sortByAttribute(attestations, value.attributeName, true);
											else
												sortByAttribute(attestations, value.attributeName, false);											
											}}>
											<>
												<span>{value.label + "     "}</span>										
												{sortByAttributeName===value.attributeName ? <img id="sortIcon" src={sortIcon} alt={value.altText} /> : ""}
											</>
										</th>
									)}
									
								</tr>
							</thead>
							<tbody>
								{favourites.map((row, i) =><AttestationMapRow key={i} atBlock={atBlock} loading={loading} lookback={lookback} toggleFavourite={toggleFavourite} data={{...row}} />)}						
								{nonFavourites.map((row, i) =><AttestationMapRow key={i} atBlock={atBlock} loading={loading} lookback={lookback} toggleFavourite={toggleFavourite} data={{...row}} />)}
							</tbody>
						</table>
					</div>        
				}
			</div>
		</div>			
	);
}

