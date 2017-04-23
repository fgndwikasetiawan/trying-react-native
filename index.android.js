import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';

class Greeting extends Component {
  render() {
      return (
	      <Text>Hello {this.props.name}! </Text>
    );
  }
}

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
