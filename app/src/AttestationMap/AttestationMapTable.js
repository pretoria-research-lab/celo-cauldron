import React, { useState } from "react";
import PropTypes from "prop-types";
import AttestationMapRow from "./AttestationMapRow";
import loadingImg from "../assets/loading.svg";
import sortDownIcon from "../assets/sort-down.svg";
import sortUpIcon from "../assets/sort-up.svg";
import favouriteIcon from "../assets/favorite_black.svg";
import "../SignedBlocks/signed-blocks-table.css";

AttestationMapTable.propTypes = () => { 
	return { 
		attestations: PropTypes.any,
		loading: PropTypes.bool,
		blockNumber: PropTypes.any,
		lookback: PropTypes.any,
		atBlock: PropTypes.any,
		toggleFavourite: PropTypes.func
	}; 
};

export default function AttestationMapTable(props) {

	const sortOptions = {
		VALIDATOR_NAME: 0,
		ATTESTATION_URL: 1,
		COMPLETED: 2,
		INCOMPLETE: 3,
		RATIO: 4,
		SELECTED: 5,
		STATUS: 6
	};

	const [currentSortedBy, setCurrentSortedBy] = useState(sortOptions.COMPLETED);
	const [currentSortIcon, setSortIcon] = useState(sortUpIcon);
	const {attestations, loading, blockNumber, atBlock, lookback, toggleFavourite} = props;
	const colSpan = lookback;
	const favourites = attestations.filter((e,i) => e.favourite === true);
	const nonFavourites = attestations.filter((e,i) => e.favourite === false);

	const sortByValidatorName = (attestations, flip) => {
		attestations.sort((x, y) => {
			let a = (x.issuerName ? x.issuerName : x.key).toLowerCase(),	b = (y.issuerName ? y.issuerName : y.key).toLowerCase();
			if(flip){a = (y.issuerName ? y.issuerName : y.key).toLowerCase(); b = (x.issuerName ? x.issuerName : x.key).toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};
	
	const sortByAttestationURL = (attestations, flip) => {
		attestations.sort((x, y) => {			
			let a = x.attestationURL.toLowerCase(), b = y.attestationURL.toLowerCase();
			if(flip){a = y.attestationURL.toLowerCase(); b = x.attestationURL.toLowerCase();}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};
	
	const sortByCompleted = (attestations, flip) => {	
		attestations.sort((x, y) => {
			let a = x.completedCount, b = y.completedCount;
			if(flip){a = y.completedCount; b = x.completedCount;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};
	
	const sortByIncomplete = (attestations, flip) => {	
		attestations.sort((x, y) => {
			let a = x.notCompletedCount, b = y.notCompletedCount;
			if(flip){ a = y.notCompletedCount; b = x.notCompletedCount;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};

	const sortBySelected = (attestations, flip) => {	
		attestations.sort((x, y) => {
			let a = x.selectedCount, b = y.selectedCount;
			if(flip){ a = y.selectedCount; b = x.selectedCount;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};

	const sortByRatio = (attestations, flip) => {	
		console.log(`Sorting by Ratio, flip = ${flip}`);
		attestations.sort((x, y) => {
			let a = x.completedRatio, b = y.completedRatio;
			if(flip){ a = y.completedRatio; b = x.completedRatio;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};

	const sortByStatus = (attestations, flip) => {	
		console.log(`Sorting by Ratio, flip = ${flip}`);
		attestations.sort((x, y) => {
			let a = x.attestationStatus, b = y.attestationStatus;
			if(flip){ a = y.attestationStatus; b = x.attestationStatus;}
			return (a === b ? 0 : a > b ? 1 : -1);
		});
	};

	const sortBy = (option) => {

		switch(option){
		case sortOptions.VALIDATOR_NAME:
			if(currentSortedBy===sortOptions.VALIDATOR_NAME) {
				sortByValidatorName(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByValidatorName(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.VALIDATOR_NAME);
			}
			break;
		case sortOptions.ATTESTATION_URL:
			if(currentSortedBy===sortOptions.ATTESTATION_URL) {
				sortByAttestationURL(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByAttestationURL(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.ATTESTATION_URL);
			}
			break;
		case sortOptions.COMPLETED:
			if(currentSortedBy===sortOptions.COMPLETED) {
				sortByCompleted(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByCompleted(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.COMPLETED);
			}
			break;				
		case sortOptions.INCOMPLETE:
			if(currentSortedBy===sortOptions.INCOMPLETE) {
				sortByIncomplete(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByIncomplete(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.INCOMPLETE);
			}
			break;
		case sortOptions.RATIO:
			if(currentSortedBy===sortOptions.RATIO) {
				sortByRatio(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByRatio(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.RATIO);
			}
			break;		
		case sortOptions.SELECTED:
			if(currentSortedBy===sortOptions.SELECTED) {
				sortBySelected(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortBySelected(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.SELECTED);
			}
			break;	
		case sortOptions.STATUS:
			if(currentSortedBy===sortOptions.STATUS) {
				sortByStatus(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByStatus(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.STATUS);
			}
			break;
		default:
			if(currentSortedBy===sortOptions.RATIO) {
				sortByRatio(attestations, true);
				setSortIcon(sortUpIcon);
			}
			else {
				sortByRatio(attestations, false);
				setSortIcon(sortDownIcon);
				setCurrentSortedBy(sortOptions.RATIO);
			}
		}		
	};

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
									<th onClick={() => {sortBy(sortOptions.VALIDATOR_NAME);}}>
										<>
											<span>Validator     </span>										
											{currentSortedBy===sortOptions.VALIDATOR_NAME ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by validator name" /> : ""}
										</>
									</th>
									<th onClick={() => {sortBy(sortOptions.ATTESTATION_URL);}}>
										<>
											<span>Attestation Service      </span>
											{currentSortedBy===sortOptions.ATTESTATION_URL ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by issuer" /> : ""}
										</>	
									</th>

									<th onClick={() => {sortBy(sortOptions.STATUS);}}>
										<>
											<span>Status      </span>
											{currentSortedBy===sortOptions.STATUS ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by status" /> : ""}
										</>	
									</th>			
									
									<th colSpan={colSpan}>{"Attestations"}</th>						

									<th onClick={() => {sortBy(sortOptions.SELECTED);}}>
										<>
											<span>Σ      </span>
											{currentSortedBy===sortOptions.SELECTED ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by selected" /> : ""}
										</>	
									</th>

									<th onClick={() => {sortBy(sortOptions.COMPLETED);}}>
										<>
											<span>✓      </span>
											{currentSortedBy===sortOptions.COMPLETED ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by completed" /> : ""}
										</>	
									</th>									

									<th onClick={() => {sortBy(sortOptions.INCOMPLETE);}}>
										<>
											<span>✘      </span>
											{currentSortedBy===sortOptions.INCOMPLETE ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by incomplete" /> : ""}
										</>	
									</th>

									<th onClick={() => {console.log("OnClick!"); sortBy(sortOptions.RATIO);}}>
										<>
											<span>%      </span>
											{currentSortedBy===sortOptions.RATIO ? <img id="sortIcon" src={currentSortIcon} alt="Sorted by complete ratio" /> : ""}
										</>	
									</th>

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

