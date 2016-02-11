var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route; 
var Navigation = ReactRouter.Navigation; // mixin
var History = ReactRouter.History;


var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');



/* 
	App
*/

var App = React.createClass({
	getInitialState : function () {
		return {
			fishes : {},
			order : {}
		}
	},

	addToOrder : function(key) {
		// set order to 1 if 0, otherwise add one to current order
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({order : this.state.order});
	},

	addFish : function(fish) {
		var timestamp = (new Date()).getTime();
		// update the state object
		this.state.fishes['fish-' + timestamp] = fish;
		// set the state
		this.setState({fishes : this.state.fishes});
	},

	loadSamples : function() {
		this.setState({
			fishes : require('./sample-fishes')
		});
	},

	renderFish : function (key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
	},

	render : function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Good" />
					<ul className="list-of-fishes">
						{/* map takes in an array and allows you
						to use the data in that array to return a new array */}
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
			</div>
		)
	}
});

/*
	Fish
	<Fish />
*/

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



/* 
	Add fish form
*/

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



/*
	Header
*/

var Header = React.createClass({
	render : function() {
		console.log(this.props)
		return (
			<header className="top">
				<h1>Catch 
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
				Day</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>
			</header>
		)
	}
});



/*
	Order
	<Order />
*/

var Order = React.createClass({
	render : function() {
		var orderIds = Object.keys(this.props.order);
		var total = orderIds.reduce((prevTotal, key)=> {
			var fish = this.props.fish[key];
			var count = this.props.order[key];
		});

		return (
			<div className="order-wrap">
				<h2 className="order-title">Your Order</h2>
				<ul className="order">

				</ul>
			</div>
		)
	}
});



/*
	Inventory
	<Inventory />
*/

var Inventory = React.createClass({
	render : function() {
		return (
			<div>
				<h2>Inventory</h2>
				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
});



/* 
	StorePicker
	This will let us make <StorePicker />
*/

var StorePicker = React.createClass({
	mixins : [History],
	goToStore : function(event) {
		event.preventDefault();
		// get data from input
		var storeId = this.refs.storeId.value;
		// transition from StorePicker to App
		this.history.pushState(null, '/store/' + storeId);
	},
	render : function() {
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please Enter a Store</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
				<input type="submit" />
			</form>
		)
	}

});



/* 
	Not found
*/

var NotFound = React.createClass({
	render : function() {
		return <h1>Not Found!</h1>
	}
});



/*
	Routes
*/

var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker} />
		<Route path="/store/:storeId" component={App} />
		<Route path="*" component={NotFound} />
	</Router>
)



ReactDOM.render(routes, document.querySelector('#main'));
