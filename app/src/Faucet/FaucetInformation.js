import React from 'react';
import QRCode from 'qrcode.react';

export default function FaucetInformation(props) {

    return (
        <div className="row">
          <div className="col-lg-4">
            <h2>{props.network + " Faucet Address"}</h2>
            <hr />
            <p className="address">{props.config ? <a href={props.config.blockExplorer + "/address/" + props.config.faucetAddress}>{props.config.faucetAddress}</a> : ""}</p>
            <hr />
            <div className='qrCode'>                      
                {props.config.faucetAddress ? <QRCode size={150} bgColor="#FFFFFF" fgColor="#2E3338" includeMargin={false} value={props.config.faucetAddress} /> : "" }
            </div>
            <hr />
            <p>{"Balance " + props.faucetBalance + " cGLD"}</p>
            <p>{"Block number " + props.blockNumber}</p>
          </div>
          <div id="how-to-prepare" className="col-lg-8">
              <h2>How To Prepare</h2>
              <hr />
              <ul>                
                <li>Use the table below to request a small slice (0.01) cGLD for testing purposes</li>
                <li>After requesting, the cGLD will cool down for 12 blocks before being served</li>
                <li>Press the confirm button to claim your faucet amount after cooldown</li>
                <li>A maximum of 10 requests can be queued at once</li>                
                <li>If someone leaves without claiming, you may confirm for them at any time</li>
                <li>Only the last 20 requests are visible on this dashboard</li>
              </ul>
              <hr />
              <h5 className="nb">This is a community kitchen - please return any cGLD if you are finished cooking</h5>
          </div>
        </div>
    );
}