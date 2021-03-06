import React from "react";
import Switch from "react-switch";
import PropTypes from "prop-types";

RefreshSwitch.propTypes = () => { 
	return { 
		setStayAtHead: PropTypes.func,
		stayAtHead: PropTypes.bool,
		switchText: PropTypes.string
	};
};

export default function RefreshSwitch(props) {
 
	return (
		<label>
			<p>{props.switchText}</p>
			<Switch onColor="#35D07F" onChange={(checked, event, id) => props.setStayAtHead(checked)} checked={props.stayAtHead} />
		</label>
	);
}