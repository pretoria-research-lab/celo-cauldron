import React from "react";
import Switch from "react-switch";
import PropTypes from "prop-types";

RefreshSwitch.propTypes = () => { 
	return { 
    stayAtHead: PropTypes.func,
    checked: PropTypes.bool
	}; 
};

export default function RefreshSwitch(props) {
 
    return (
      <label>
        <p>Stay at head</p>
        <Switch onColor="#35D07F" onChange={(checked, event, id) => props.stayAtHead(checked, event)} checked={props.checked} />
      </label>
    );
}