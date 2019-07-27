import React, { Component } from 'react';
import axios from 'axios';
import { HuePicker } from 'react-color';
import { calculateXY } from '@q42philips/hue-color-converter';

// SCSS
import '../scss/ColorPicker.scss';

class ColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			API_URL: this.props.API_URL,
			chosenColor: '#000',
			allLights: '/groups/1/action',
			lights: [],
			light: '/lights/'
		}
		this.onChangeComplete = this.onChangeComplete.bind(this);
	}
	// Convert RGB to HEX
	convertToHex(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	// Convert HEX to [X, Y]
	convertToXY(hex) {
		const rgb = this.convertToHex(hex);
		const { r, g, b } = rgb
		return calculateXY(r, g, b);
	}
	// Change light color
	onChangeComplete(color) {
		this.setState({
			chosenColor: color.hex
		});
		axios({
				method: 'put',
				url: this.state.API_URL + this.state.allLights,
				data: {
					xy: this.convertToXY(color.hex),
					bri: 255
				}
			})
			.catch((err) => {
				alert('Error changing color, please try again')
			});
	}
	// Get light info
	componentWillMount() {
		axios.get(this.state.API_URL)
			.then((res) => { return res.data })
			.then((data) => {
				// Initial number of lights (0)
				let lights = [];
				// For each light found, add to total lights
				for (var i = 1; i <= Object.keys(data.lights).length; i++) {
					lights.push(data.lights[`${i}`]);
				}
				this.setState({ lights });
			})
			.catch(() => {
				console.log('ERROR')
			});
		axios.get(this.state.API_URL + '/groups/1')
			.then((res) => { return res.data })
			.then((data) => {
				// Get current color of lights
				this.setState({
					chosenColor: this.xyBriToRgb(data.action.xy[0], data.action.xy[1], data.action.bri)
				});
			})
			.catch(() => { console.log('ERROR') });
	}
	// Convert [X, Y] to RGB
	xyBriToRgb(x, y, bri) {
		let z = 1.0 - x - y;

		let Y = bri / 255.0; // Brightness of lamp
		let X = (Y / y) * x;
		let Z = (Y / y) * z;

		let r = X * 1.612 - Y * 0.203 - Z * 0.302;
		let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
		let b = X * 0.026 - Y * 0.072 + Z * 0.962;

		r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
		g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
		b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
		let maxValue = Math.max(r, g, b);

		r /= maxValue;
		g /= maxValue;
		b /= maxValue;

		r = r * 255;   if (r < 0) { r = 255 };
		g = g * 255;   if (g < 0) { g = 255 };
		b = b * 255;   if (b < 0) { b = 255 };

		r = Math.round(r).toString(16);
		g = Math.round(g).toString(16);
		b = Math.round(b).toString(16);

		if (r.length < 2)
			r = "0" + r;
		if (g.length < 2)
			g = "0" + g;
		if (b.length < 2)
			b = "0" + r;
		var hex = "#" + r + g + b;

		return hex;
	}
	// Toggle individual light
	toggleLight(e, i) {
		i = i + 1;
		axios.get(this.state.API_URL + this.state.light + i)
			.then((res) => { return res.data.state.on })
			.then((isOn) => {
				axios({
					method: 'put',
					url: this.state.API_URL + this.state.light + i + '/state',
					data: {
						on: !isOn
					}
				})
				.catch(() => { console.log('ERROR') })
			})
			.catch(() => { console.log('ERROR') });
	}
	render() {
		const { lights, chosenColor } = this.state
		return (
			<div id="color-picker">
				<HuePicker color={chosenColor} onChangeComplete={ this.onChangeComplete } />
				<div className="active-lights">
					<h1>Total Lights: {lights.length} </h1>
					<div className="lights">
						{lights.map((light, i) => {
							return (
								<div key={i} className="light" onClick={e => this.toggleLight(e, i)}>
									<h4>{light.productname}</h4>
									<i style={{ color: chosenColor }} className="fas fa-lightbulb"></i>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}
}

export default ColorPicker;
