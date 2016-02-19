/*
	Fish
	<Fish />
*/

import React from 'react';
import h from '../helpers';

var Fish = React.createClass({
	onButtonClick : function() {
		console.log("going to add the fish: ", this.props.index);
		var key = this.props.index;
		this.props.addToOrder(key);
	},

	render : function() {
		var details = this.props.details;
		// if status is available = true, if not = false
		var isAvailable = (details.status === 'available' ? true : false);
		// if isAvailable 
		var buttonText = (isAvailable ? 'Add to Order' : 'Sold Out!');
		return (
			<li className="menu-fish">
				<img src={details.image} alt="{details.name}" />
				<h3 className="fish-name">
					{details.name}
					<span className="price">{details.price}</span>
				</h3>
				<p>{details.desc}</p>
				{/* if isAvailable=false, button is disabled */}
				<button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
			</li>
		)
	}
});

export default Fish;
