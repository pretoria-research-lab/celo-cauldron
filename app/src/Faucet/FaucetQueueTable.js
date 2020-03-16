import React from "react";
import PropTypes from "prop-types";
import FaucetQueueRow from "./FaucetQueueRow";
import EmptyFaucetQueueRow from "./EmptyFaucetQueueRow";
import loadingImg from "../assets/loading.svg";

FaucetQueueTable.propTypes = () => { 
	return { 
		faucetRequests: PropTypes.any,
		loading: PropTypes.bool,
		blockNumber: PropTypes.any,
		config: PropTypes.any,
		claimRequest: PropTypes.func,
		createRequest: PropTypes.func
	}; 
};	

export default function FaucetQueueTable(props) {

	const {faucetRequests, loading, blockNumber, config, claimRequest, createRequest} = props;

	return (
		<div className="row">
			<div className="col-lg-12 text-center">
				{ loading ? 
					<img id="loadingLogo" src={loadingImg} alt="Loading..." />
					:
					<div className="table-responsive">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th>Request Address</th>
									<th>Requested Block</th>
									<th>Status</th>
									<th>Claimed Block</th>
									<th>Claimed txId</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<EmptyFaucetQueueRow onClick={createRequest}/>
								{faucetRequests.map((fr, i) =><FaucetQueueRow config={config} onClick={claimRequest} blockNumber={blockNumber} key={i} faucetRequest={{...fr}} />)}
							</tbody>
						</table>
					</div>        
				}
			</div>
		</div>			
	);
}

