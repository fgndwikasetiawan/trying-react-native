import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import Greeting from './greeting.js';


class LotsOfGreetings extends Component {
    render() {
	const names = ['Aids', 'Bob', 'Cancer', 'Diabetes', 'Ebola'].map((name, key) => <Greeting key={key} name={name}/>);
	return (
		<View style={{alignItems: 'center'}}>
		{names}
	        </View>
	);
    }
}

AppRegistry.registerComponent('reactNative', () => LotsOfGreetings);
