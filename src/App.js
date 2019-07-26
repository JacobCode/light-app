import React, { Component } from 'react';

// API Config
import url from './config';

// Components
import ColorPicker from './components/ColorPicker';
import ToggleSwitch from './components/ToggleSwitch';
import BrightnessController from './components/BrightnessController';

class App extends Component {
	constructor() {
		super();
		this.state = {
			API_URL: url
		}
	}
	render() {
		const { API_URL } = this.state;
		return (
			<div className="App">
				<ColorPicker API_URL={API_URL} />
				<ToggleSwitch API_URL={API_URL} />
				<BrightnessController API_URL={API_URL} />
			</div>
		);
	}
}

export default App;
