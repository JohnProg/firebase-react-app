/*
	Inventory
	<Inventory />
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import Firebase from 'firebase';
const ref = new Firebase('https://sweltering-inferno-9174.firebaseio.com/');
// Firebase(config.firebasurl)

var Inventory = React.createClass({

	getInitialState : function () {
		return {
			uid : ''
		}
	},

	authenticate(provider) {
		console.log("Trying to auth with " + provider);
		ref.authWithOAuthPopup(provider, this.authHandler);
	},

	componentWillMount() {
		console.log("Checking to see if we can log them in");
		var token = localStorage.getItem('token');
		if(token) {
			ref.authWithCustomToken(token, this.authHandler);
		}
	},

	logout() {
		ref.unauth();
		localStorage.removeItem('token');
		this.setState({
			uid : null
		});
	},

	authHandler(err, authData) {
		if(err) {
			console.error(err);
			return;
		}

		// save login token in browser
		localStorage.setItem('token', authData.token);

		console.log(this.props.params.storeId);
		const storeRef = ref.child(this.props.params.storeId);
		storeRef.on('value', (snapshot)=> {
			var data = snapshot.val() || {};

			// if no owner exists
			if(!data.owner) {
				// claim it as our own
				storeRef.set({
					owner : authData.uid
				});
			}

			// update state to reflect current store owner and user
			this.setState({
				uid : authData.uid,
				owner : data.owner || authData.uid
			});

		});
	},

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="github" onClick={this.authenticate.bind(this, 'github')}>Log in with Github</button>
				<button className="facebook"onClick={this.authenticate.bind(this, 'facebook')}>Log in with Facebook</button>
				<button className="twitter"onClick={this.authenticate.bind(this, 'twitter')}>Log in with Twitter</button>
			</nav>
		)
	},

	renderInventory : function(key) {
		var linkState = this.props.linkState;
		return (
			<div className="fish-edit" key={key}>
				<input type="text" valueLink={linkState('fishes.'+ key +'.name')} />
				<input type="text" valueLink={linkState('fishes.'+ key +'.price')} />
				<select valueLink={linkState('fishes.'+ key +'.status')}>
					<option value="unavailable">Sold Out!</option>
					<option value="available">Fresh!</option>
				</select>

				<textarea valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
				<input type="text" valueLink={linkState('fishes.'+ key +'.image')} />
				<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
			</div>
		)
	},

	render : function() {
		let logoutButton = <button onClick={this.logout}>Logout</button>

		// first check if user is not logged in
		if(!this.state.uid) {
			return (
				<div>{this.renderLogin()}</div>
			)
		}

		// then check if they aren't owner of current store
		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you aren't the owner of this store.</p>
					{logoutButton}
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logoutButton}
				{Object.keys(this.props.fishes).map(this.renderInventory)}

				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	},
	propTypes : {
		addFish : React.PropTypes.func.isRequired,
		loadSamples : React.PropTypes.func.isRequired,
		fishes : React.PropTypes.object.isRequired,
		removeFish : React.PropTypes.func.isRequired,
		linkState : React.PropTypes.func.isRequired
	}
});

export default Inventory;