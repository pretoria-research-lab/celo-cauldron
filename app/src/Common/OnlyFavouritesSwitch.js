import React from "react";
import Switch from "react-switch";
import PropTypes from "prop-types";

OnlyFavouritesSwitch.propTypes = () => { 
	return { 
		setOnlyFavourites: PropTypes.func,
		onlyFavourites: PropTypes.bool
	}; 
};

export default function OnlyFavouritesSwitch(props) {
 
	return (
		<label>
			<p>Favourites only</p>
			<Switch onColor="#35D07F" onChange={(checked, event, id) => props.setOnlyFavourites(checked, event)} checked={props.onlyFavourites} />
		</label>
	);
}