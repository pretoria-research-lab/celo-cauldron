import React from "react";
import PropTypes from "prop-types";
import SignedBlocksRow from "./SignedBlocksRow";
import loadingImg from "../assets/loading.svg";

SignedBlocksTable.propTypes = () => { 
	return { 
		signatures: PropTypes.any,
		loading: PropTypes.bool,
		blockNumber: PropTypes.any,
		lookback: PropTypes.any,
		atBlock: PropTypes.any,
		sortByValidatorName: PropTypes.func,
		sortBySignerAddress: PropTypes.func
	}; 
};	

export default function SignedBlocksTable(props) {

	const {signatures, loading, blockNumber, atBlock, lookback, sortByValidatorName, sortBySignerAddress} = props;

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
									<th onClick={() => sortByValidatorName()}>Validator</th>
									<th onClick={() => sortBySignerAddress()}>Signer</th>					
									<th colSpan={lookback}>{"Block " + (+atBlock- +lookback) + " to " + +atBlock}</th>						
									<th>Signed</th>
									<th>Missed</th>
									{/* <th>Other</th> */}
								</tr>
							</thead>
							<tbody>								
								{signatures.map((row, i) =><SignedBlocksRow key={i} lookback={lookback} signedBlocksRow={{...row}} />)}
							</tbody>
						</table>
					</div>        
				}
			</div>
		</div>			
	);
}

