/* 
	Add fish form
	<AddFishForm />
*/

import React from 'react';

var AddFishForm = React.createClass({
	createFish : function(event) {
		// stop form from submitting
		event.preventDefault();
		// take data from form and create an object
		var fish = {
			name : this.refs.name.value,
			price : this.refs.price.value,
			status : this.refs.status.value,
			desc : this.refs.desc.value,
			image : this.refs.image.value
		}

		// add the fish to the app state
		this.props.addFish(fish);
		this.refs.fishForm.reset();

	},
	render : function() {
		return (
			<form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
				<input type="text" ref="name" placeholder="Fish Name"/>
				<input type="text" ref="price" placeholder="Fish Price"/>
				<select ref="status">
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" ref="desc" placeholder="Desc"></textarea>
				<input type="text" ref="image" placeholder="URL to image"/>
				<button type="submit">+ Add Item</button>
			</form>
		)
	}
});

export default AddFishForm;