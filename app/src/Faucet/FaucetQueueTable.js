import React, { Component } from 'react';
import FaucetQueueList from './FaucetQueueList';

export default class FaucetQueueTable extends Component {

  render = () => {

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 text-centre">
              <FaucetQueueList faucetRequests={this.props.faucetRequests} claimRequest={this.props.claimRequest} />
          </div>    
        </div>
    </div>);
    }
}

