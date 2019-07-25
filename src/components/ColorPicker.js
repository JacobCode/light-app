import React, { Component } from 'react';
import axios from 'axios';
import { HuePicker } from 'react-color';
import { calculateXY } from '@q42philips/hue-color-converter';

class ColorPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			API_URL: this.props.API_URL,
			chosenColor: '#34c9eb',
			allLights: '/groups/1/action'
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

	componentDidMount() {
		this.convertToXY('#00ff00');
	}
	render() {
		return (
			<div id="color-picker">
				<HuePicker color={this.state.chosenColor} onChangeComplete={ this.onChangeComplete } />
			</div>
		)
	}
}

export default ColorPicker;
