import React, { Component } from 'react';
import axios from 'axios';

// API Config
import url from './config';

// Components
import ColorPicker from './components/ColorPicker';

class App extends Component {
	constructor() {
		super();
		this.state = {
			API_URL: url,
			lights: []
		}
	}
	componentWillMount() {
		axios.get(this.state.API_URL)
			.then((res) => { return res.data })
			.then((data) => {
				let lights = []
				for (var i = 1; i <= Object.keys(data.lights).length; i++) {
					lights.push(data.lights[`${i}`]);
				}
				this.setState({ lights });
			})
			.catch(() => {
				console.log('ERROR')
			})
	}
	render() {
		const { API_URL, lights } = this.state;
		return (
			<div className="App">
				<ColorPicker API_URL={API_URL} />
				<h1>Total Lights: {lights.length} </h1>
				<div className="lights">
					{lights.map((light, i) => {
						console.log(light)
						return (
							<div key={i} className="light">
								<h4>{light.productname}</h4>
								<i className={`fas ${light.productname === 'Hue color lamp' ? 'fa-lightbulb' : light.productname === 'Hue go' ? 'fa-adjust' : ''}`}></i>
							</div>
						)
					})}
				</div>
			</div>
		);
	}
}

export default App;
