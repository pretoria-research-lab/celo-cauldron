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
          </div>
          <div id="how-to-prepare" className="col-lg-8">
              <h2>How To Prepare</h2>
              <hr />
              <ul>                
                <li>Use the table below to request a small amount of cGLD for testing purposes</li>
                <li>After you have requested, you must let the cGLD cool down for at least 12 blocks before claiming</li>
                <li>A maximum of 10 unclaimed requests can exist at once</li>
                <li>This is a community kitchen - please return any cGLD crumbs if you are finished cooking</li>
              </ul>
              <hr />
          </div>
        </div>
    );
}