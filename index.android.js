import React, { Component } from 'react';
import ItemInfoScreen from './item-info-screen.js';
import ItemSearchScreen from './item-search-screen.js';
import AddItemScreen from './add-item-screen.js';
import { AppRegistry, Button, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Database from './database.js';

class Main extends React.Component {
	constructor(props) {
		super(props);
		let db = Database;
		let items = db.getItems();
		this.state = {
			db: db,
			item: items[0]
		}
	}

	static navigationOptions = {
		headerVisible: false
	};

	render() {	
		const {navigate} = this.props.navigation;
		return(
			<View>
				<View style={{paddingTop: 10}}>
					<Text>Main screen</Text>
				</View>
				<View>
					<TouchableOpacity 
					 style={style.button}
					 onPress={() => navigate('ItemSearch', {item: this.state.item})} >
					 	<Text style={style.buttonText}>CARI BARANG</Text>
					 </TouchableOpacity>

					 <TouchableOpacity 
					 style={style.button}
					 onPress={() => navigate('AddItem', {item: this.state.item})} >
					 	<Text style={style.buttonText}>TAMBAH BARANG</Text>
					 </TouchableOpacity>
				</View>
			</View>
		);
	}
}

//Navigation

const style = StyleSheet.create({
	button: { 
		width: 100,
		height: 40,
		marginTop: 10,
		borderRadius: 5, 
		backgroundColor: "#5af", 
		justifyContent: "center", 
		alignItems: "center",
		elevation: 10
	},
	buttonText: {
		fontWeight: "bold", color: "white"
	}
	
});

const App = StackNavigator({
	Main: {screen: Main},
	ItemSearch: {screen: ItemSearchScreen},
	ItemInfo: {screen: ItemInfoScreen},
	AddItem: {screen: AddItemScreen}
});

AppRegistry.registerComponent("reactNative", () => App);