import React from "react";
import {data} from "../Utils/data";
import communityIcon from "../assets/03-People (dark-bg).png";
import securityIcon from "../assets/11-Security Check (dark-bg).png";

const alphaSort = (a,b) => {
	if(a < b) return -1;
	if(a > b) return 1;
	return 0;
};

export default function HomeInformation() {

	return (
		<div className="row">			
			
			<div className="link-list col-sm-6">
				<table className="table table-dark table-hover responsive col-sm-12">
					<thead>
						<tr colSpan={2}><th><h2><img className="tiny-icon" src={securityIcon} alt="cLabs resource"/> cLabs</h2></th></tr>
					</thead>
					<tbody>
						{data.resources.filter(item => item.community===false).sort((a,b) => alphaSort(a.blurb, b.blurb)).map((item,i) =>
							<tr key={i} className="small-padding">
								<td id="left">{item.blurb}</td>
								<td id="right"><a href={item.link}>{item.link}</a></td>
							</tr>
						)}
					</tbody>
				</table>                
			</div>

			<div className="link-list col-sm-6">
				<table className="table table-dark table-hover responsive col-sm-12">
					<thead>
						<tr colSpan={2}><th><h2><img className="tiny-icon" src={communityIcon} alt="Community based resource" /> Community</h2></th></tr>
					</thead>
					<tbody>
						{data.resources.filter(item => item.community===true).sort((a,b) => alphaSort(a.blurb, b.blurb)).map((item,i) =>
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