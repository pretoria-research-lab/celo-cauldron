import React, { useState } from "react";
import PropTypes from "prop-types";
import SignedBlocksRow from "./SignedBlocksRow";
import loadingImg from "../assets/loading.svg";
import sortDownIcon from "../assets/sort-down.svg";
import sortUpIcon from "../assets/sort-up.svg";
import favouriteIcon from "../assets/favorite.svg";

SignedBlocksTable.propTypes = () => { 
	return { 
		signatures: PropTypes.any,
		loading: PropTypes.bool,
		blockNumber: PropTypes.any,
		lookback: PropTypes.any,
		atBlock: PropTypes.any,
		sortByValidatorName: PropTypes.func,
		sortBySignerAddress: PropTypes.func,
		toggleFavourite: PropTypes.func
	}; 
};

export default function SignedBlocksTable(props) {

	const [isSortedByValidator, sortByValidator] = useState(false);
	const [isSortedBySigner, sortBySigner] = useState(false);
	const [isSortedBySignedBlocks, sortBySignedBlocks] = useState(false);
	const [isSortedByMissedBlocks, sortByMissedBlocks] = useState(true);
	const [sortUp, setSortUp] = useState(true);

	const {signatures, loading, blockNumber, atBlock, lookback, sortByValidatorName, sortBySignerAddress, sortBySignedCount, sortByMissedCount, toggleFavourite} = props;

	const colSpan = lookback;
	// console.log("Setting colSpan for signed blocks display to " + colSpan);

	const favourites = signatures.filter((e,i) => e.favourite === true);
	// console.log("There are " + favourites.length + " favourites");

	const nonFavourites = signatures.filter((e,i) => e.favourite === false);
	// console.log("There are " + nonFavourites.length + " non-favourites");

	return (
		<div className="row">
			<div className="col-lg-12 text-center">
				{ loading || blockNumber === -1 ? 
					<img id="loadingLogo" src={loadingImg} alt="Loading..." />
					:
					<div className="table-responsive">
						<table className="signed-blocks table table-bordered table-hover">
							<thead>
								<tr>
									<th><img id="favouriteIconTableHeader" src={favouriteIcon} alt="Favourite this row" /></th>
									<th onClick={() => {setSortUp(!sortUp); sortByValidator(true); sortBySigner(false); sortBySignedBlocks(false); sortByMissedBlocks(false); sortByValidatorName(sortUp);}}>
										<>
											<span>Validator     </span>										
											{isSortedByValidator ? sortUp ? <img id="sortIcon" src={sortDownIcon} alt="Sorted by validator" /> : <img id="sortIcon" src={sortUpIcon} alt="Sorted by validator" /> : ""}
										</>
									</th>
									<th onClick={() => {setSortUp(!sortUp); sortByValidator(false); sortBySigner(true); sortBySignedBlocks(false); sortByMissedBlocks(false); sortBySignerAddress(sortUp);}}>
										<>
											<span>Signer      </span>
											{isSortedBySigner ? sortUp ? <img id="sortIcon" src={sortDownIcon} alt="Sorted by signer" /> : <img id="sortIcon" src={sortUpIcon} alt="Sorted by signer" /> : ""}
										</>	
									</th>			
									<th colSpan={colSpan}>{"Block " + (+atBlock- +lookback) + " to " + +atBlock}</th>						
									<th onClick={() => {setSortUp(!sortUp); sortByValidator(false); sortBySigner(false); sortBySignedBlocks(true); sortByMissedBlocks(false); sortBySignedCount(sortUp);}}>
										<>
											<span>Signed      </span>
											{isSortedBySignedBlocks ? sortUp ? <img id="sortIcon" src={sortDownIcon} alt="Sorted by signed blocks" /> : <img id="sortIcon" src={sortUpIcon} alt="Sorted by signed blocks" /> : ""}
										</>	
									</th>	
									<th onClick={() => {setSortUp(!sortUp); sortByValidator(false); sortBySigner(false); sortBySignedBlocks(false); sortByMissedBlocks(true); sortByMissedCount(sortUp);}}>
										<>
											<span>Missed      </span>
											{isSortedByMissedBlocks ? sortUp ? <img id="sortIcon" src={sortDownIcon} alt="Sorted by missed signatures" /> : <img id="sortIcon" src={sortUpIcon} alt="Sorted by missed signatures" /> : ""}
										</>	
									</th>
									{/* <th>Other</th> */}
								</tr>
							</thead>
							<tbody>
								{favourites.map((row, i) =><SignedBlocksRow key={i} loading={loading} lookback={lookback} toggleFavourite={toggleFavourite} signedBlocksRow={{...row}} />)}						
								{nonFavourites.map((row, i) =><SignedBlocksRow key={i} loading={loading} lookback={lookback} toggleFavourite={toggleFavourite} signedBlocksRow={{...row}} />)}
							</tbody>
						</table>
					</div>        
				}
			</div>
		</div>			
	);
}

