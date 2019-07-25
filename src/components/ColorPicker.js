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

	convertToHex(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}

	convertToXY(hex) {
		const rgb = this.convertToHex(hex);

		const r = rgb.r;
		const g = rgb.g;
		const b = rgb.b;

		return calculateXY(r, g, b);
	}

	onChangeComplete(color) {
		this.setState({
			chosenColor: color.hex
		});
		axios({
				method: 'put',
				url: this.state.API_URL + this.state.allLights,
				data: {
					xy: this.convertToXY(color.hex)
				}
			})
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				alert('Error changing color, please try again')
			});
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

	toggleLight(e, i) {
		i = i+1;
		axios.get(this.state.API_URL + this.state.light + i)
			.then((res) => { return res.data })
			.then((data) => {
				return data.state.on;
			})
			.then((isOn) => {
				axios({
					method: 'put',
					url: this.state.API_URL + this.state.light + i + '/state',
					data: {
						on: !isOn
					}
				})
				.then(() => {
					console.log(this.state.API_URL + this.state.light + i + '/state')
				})
			})
	}
	render() {
		const { lights, chosenColor } = this.state
		return (
			<div id="color-picker">
				<HuePicker color={chosenColor} onChangeComplete={ this.onChangeComplete } />
				<h1>Total Lights: {lights.length} </h1>
				<div className="lights">
					{lights.map((light, i) => {
						return (
							<div key={i} className="light" onClick={e => this.toggleLight(e, i)}>
								<h4>{light.productname}</h4>
								<i style={{color: chosenColor}} className="fas fa-lightbulb"></i>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export default ColorPicker;
