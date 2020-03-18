import React from "react";
import {data} from "../Utils/data";
import communityIcon from "../assets/03-People (light-bg).png";
import securityIcon from "../assets/11-Security Check (light-bg).png";

const alphaSort = (a,b) => {
	if(a < b) return -1;
	if(a > b) return 1;
	return 0;
};

export default function HomeInformation() {

	return (
		<div className="column centered">
			<div className="link-list col-lg-8">
				<h2><img className="tiny-icon" src={securityIcon} alt="cLabs resource"/> cLabs</h2>
				<hr />                
				<table className="responsive col-lg-12">
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

			<div className="link-list col-lg-8">
				<h2><img className="tiny-icon" src={communityIcon} alt="Community based resource" /> Community</h2>
				<hr />                        
				<table className="responsive col-lg-12">
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