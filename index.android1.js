import React, { Component } from 'react';
import ItemInfoScreen from './item-info-screen.js';
import { AppRegistry, Button, View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Database from './database.js';

class Main extends React.Component {
	constructor(props) {
		super(props);
		let db = new Database();
		let items = db.getItems();
		this.state = {
			db: db,
			item: items[0]
		}
	}

	static navigationOptions = {
		title: 'Welcome',
		headerVisible: false
	};

	render() {	
		const {navigate} = this.props.navigation;
		return(
			<View>
				<View style={{paddingTop: 10}}>
					<Text>Main screen</Text>
				</View>
				<View style={{paddingTop: 10}}>
					<Button title="item info" onPress={() => navigate('ItemInfo', {item: this.state.item})} />
				</View>
			</View>
		);
	}
}

//Navigation

const App = StackNavigator({
	Main: {screen: Main},
	ItemInfo: {screen: ItemInfoScreen}
});

//AppRegistry.registerComponent("reactNative", () => App);