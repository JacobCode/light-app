import React, { Component } from 'react';
import axios from 'axios';

class ToggleSwitch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			API_URL: props.API_URL,
			isOn: true,
			allLights: '/groups/1/action'
		}
		this.toggleLight = this.toggleLight.bind(this);
	}
	toggleLight() {
		axios({
			method: 'put',
			url: this.state.API_URL + this.state.allLights,
			data: {
				on: !this.state.isOn
			}
		})
		.then(() => this.setState({ isOn: !this.state.isOn }))
	}
	componentWillMount() {
		axios.get(this.state.API_URL + '/groups/1')
			.then((res) => { return res.data })
			.then((data) => {
				this.setState({ isOn: data.state.all_on })
			})
			.catch(() => {
				console.log('ERROR')
			})
	}
	render() {
		return (
			<div id="toggle-switch">
				<div className="switch" onClick={this.toggleLight}>
					<h3>Lights: {`${this.state.isOn === true ? 'ON' : 'OFF'}`}</h3>
					<i className="fas fa-power-off"></i>
				</div>
			</div>
		)
	}
}

export default ToggleSwitch;
