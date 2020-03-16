import React from "react";
import {data} from "../Utils/data";

export default function HomeInformation() {

	return (
		<div className="column tools col-lg-12">
			<div className="link-list col-lg-8">
				<h2>Developer Resources</h2>
				<hr />                
				<table className="responsive col-lg-12">
					<tbody>
						{data.developerResources.map((item,i) =>
							<tr key={i} className="small-padding">
								<td id="left">{item.blurb}</td>
								<td id="right"><a href={item.link}>{item.link}</a></td>
							</tr>
						)}
					</tbody>
				</table>   
                
			</div>

			<div className="link-list col-lg-8">
				<h2>Validator Resources</h2>
				<hr />                        
				<table className="responsive col-lg-12">
					<tbody>
						{data.validatorResources.map((item,i) =>
							<tr key={i} className="small-padding">
								<td id="left">{item.blurb}</td>
								<td id="right"><a href={item.link}>{item.link}</a></td>
							</tr>
						)}
					</tbody>
				</table>  
			</div>
		</div>
	);
}