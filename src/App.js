import React, { Component } from 'react';

// API Config (your custom url here)
// Example http://10.0.0.123/api/IaeyJd6wP0W3R2SU3-trISZlplAhl8j5TAVqMPx8
import url from './config';

// Reset Default CSS
import './scss/Reset.scss';

// Components
import ColorPicker from './components/ColorPicker';
import ToggleSwitch from './components/ToggleSwitch';
import BrightnessController from './components/BrightnessController';

class App extends Component {
	constructor() {
		super();
		this.state = {
			API_URL: url,
			IP: '',
			USERNAME: ''
		}
		this.handleForm = this.handleForm.bind(this);
		this.handleIP = this.handleIP.bind(this);
		this.handleUSERNAME = this.handleUSERNAME.bind(this);
	}
	handleForm(e) {
		e.preventDefault();
		const URL = `http://${this.state.IP}/api/${this.state.USERNAME}`;
		localStorage.setItem('lightAPI', JSON.stringify(URL));
		this.setState({ IP: '', USERNAME: '' });
	}
	handleIP(e) {
		this.setState({ IP: e.target.value });
	}
	handleUSERNAME(e) {
		this.setState({ USERNAME: e.target.value });
	}
	render() {
		const { API_URL } = this.state;
		return (
			<div className="App">
				{localStorage.lightAPI !== undefined ?
				<div className="controller">
					<ColorPicker API_URL={API_URL} />
					<ToggleSwitch API_URL={API_URL} />
					<BrightnessController API_URL={API_URL} />
				</div>
				:
				<div className="form-container">
					<h1>Lights Info <span role="img" aria-label="Enter Light Info">💡</span></h1>
					<form onSubmit={this.handleForm}>
						<input onChange={this.handleIP} value={this.state.IP} type="text" placeholder="IP" required />
						<input onChange={this.handleUSERNAME} value={this.state.USERNAME} type="text" placeholder="USERNAME" required />
						<button type="submit">Submit</button>
					</form>
				</div>}
			</div>
		);
	}
}

export default App;
