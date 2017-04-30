import React, { Component } from 'react';
import ItemInfoScreen from './item-info-screen.js';
import ItemSearchScreen from './item-search-screen.js';
import AddItemScreen from './add-item-screen.js';
import { AppRegistry, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Realm from 'realm';
import { Barang, Stok, REALM_SCHEMA_VERSION } from './database.js';

const REALM_SERVER = '128.199.186.34:9080';

class Main extends React.Component {

	static navigationOptions = {
		headerVisible: false
	};

	constructor(props) {
		super(props);
		this.state = {
			isReady: false
		};

		//Make a realm object synced with the server
		Realm.Sync.User.login('http://' + REALM_SERVER, 'maria.setiawati0801@gmail.com', 'palasari',
			(error, user) => {
				if (!error) {
					let realm = new Realm({
						sync: {
							url: 'realm://' + REALM_SERVER + '/~/test-realm',
							user: user
						},
						schema: [Barang, Stok],
						schemaVersion: REALM_SCHEMA_VERSION
					});
					this.onDatabaseReady(realm);
				} else {
					this.onDatabaseError(error);
				}
			}
		)
	}

	onDatabaseReady(realm) {
		this.setState({
			isReady: true,
			realm: realm
		})
	}

	onDatabaseError(error) {
		ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
	}

	render() {	
		const {navigate} = this.props.navigation;

		if (!this.state.isReady) {
			return (
				<View style={{height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
					<ActivityIndicator size="large" color="grey"/>
				</View>
			);
		}

		return(
			<View>
				<View style={{paddingTop: 10}}>
					<Text>Main screen</Text>
				</View>
				<View>
					<TouchableOpacity 
					 style={style.button}
					 onPress={() => navigate('ItemSearch', {realm: this.state.realm})} >
					 	<Text style={style.buttonText}>CARI BARANG</Text>
					 </TouchableOpacity>

					 <TouchableOpacity 
					 style={style.button}
					 onPress={() => navigate('AddItem', {realm: this.state.realm})} >
					 	<Text style={style.buttonText}>TAMBAH BARANG</Text>
					 </TouchableOpacity>
				</View>
			</View>
		);
	}
}

// Navigation

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