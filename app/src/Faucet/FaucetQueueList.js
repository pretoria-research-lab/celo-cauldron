
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import FaucetQueueRow from './FaucetQueueRow';

export default class FaucetQueueList extends Component {
	
	render = () => {

		const {faucetRequests} = this.props;

		return (
			<div>
				<Table responsive striped bordered hover size="sm">
					<thead className="dark-highlight-bg">
						<tr>
							<th>address</th>
							<th>createdBlockNumber</th>
							<th>status</th>
							<th>claimedBlockNumber</th>
							<th>txId</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{faucetRequests.map((fr, i) =><FaucetQueueRow onClick={this.props.claimRequest} key={i} faucetRequest={{...fr}} />)}
					</tbody>
				</Table>
			</div>
		)
	}
}

