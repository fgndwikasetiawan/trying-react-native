import React, { Component } from 'react';
import {AppRegistry, Text, View, ListView} from 'react-native';
import Realm from 'realm';

class Main extends Component {
	constructor(props) {
		super(props);
		const realm = new Realm(
			{
				schema: [
					{
						name: 'Dog', 
						properties: {name: 'string'}
					}
				]
			}
		);
		const dogs = realm.objects('Dog');
		this.state = {
			doggos: dogs
		}	
	}

	render() {	
		const dataSource = new ListView.DataSource();
		return (
			<View>
				<Text>
					Count of Dogs in Realm: {length}
				</Text>
			</View>
		);
	}
}

AppRegistry.registerComponent('reactNative', () => Main);