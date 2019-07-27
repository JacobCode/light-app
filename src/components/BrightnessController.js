import React, { Component } from 'react';
import axios from 'axios';

// SCSS
import '../scss/BrightnessController.scss';

class BrightnessController extends Component {
	constructor(props) {
		super(props);
		this.state = {
			API_URL: this.props.API_URL,
			brightness: 0,
			bri: 0,
			allLights: '/groups/1/action'
		}
		this.changeBrightness = this.changeBrightness.bind(this);
	}
	// Change Brightness With Slider
	changeBrightness(e) {
		var brightness = e.target.value;
		var bri = Math.round((brightness * 255) / 100);
		if (brightness !== this.state.brightness) {
			this.setState({
				brightness: brightness,
				bri: bri
			})
			axios({
					method: 'put',
					url: this.state.API_URL + this.state.allLights,
					data: {
						bri
					}
				})
				.catch(err => console.log(err));
		}
	}
	componentWillMount() {
		axios.get(this.state.API_URL)
			.then((res) => { return res.data })
			.then((data) => {
				this.setState({ brightness: Math.round((data.groups[1].action.bri / 255) * 100) })
			})
	}
	render() {
		return (
			<div id="brightness-controller">
				<div className="container">
                    <h6>Brightness: {this.state.brightness}%</h6>
                    <input onChange={this.changeBrightness} type="range" min="0" max="100" value={this.state.brightness} className="slider"></input>
                </div>
			</div>
		)
	}
}

export default BrightnessController;
