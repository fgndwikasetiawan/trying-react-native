import React, { Component } from 'react';
import ItemInfoScreen from './item-info-screen.js';
import ItemSearchScreen from './item-search-screen.js';
import AddItemScreen from './add-item-screen.js';
import StockReportScreen from './stock-report-screen.js';
import AddTransactionScreen from './add-transaction-screen.js';
import TransactionReportScreen from './transaction-report-screen.js';
import { AppRegistry, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Realm from 'realm';
import { Barang, Stok, Transaksi, BarangTransaksi, RealmConfigs } from './database.js';
import {Button} from './buttons.js';

function MenuCard(props) {
	return(
		<TouchableOpacity style={[{
			backgroundColor: 'white',
			elevation: 2
		}, props.cardStyle]}
			onPress={props.onPress}
		>
			<View
				style={[{paddingTop: 10, paddingBottom: 10, height: props.iconHeight || 100, justifyContent: 'center', alignItems: 'center'}, props.iconStyle]}
			>
				{props.icon}
			</View>
			<View style={[{paddingBottom: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: props.titleBackgroundColor || 'white'}, props.titleBackgroundStyle]}>
				<Text style={{fontSize: 16, color: props.titleColor || 'black', fontWeight: 'bold'}}>{props.title}</Text>
			</View>
		</TouchableOpacity>
	);
}

class Main extends React.Component {

	static navigationOptions = {
		headerTitle: 'Beranda',
		headerTitleStyle: {color: 'white', fontWeight: 'bold'},
		headerStyle: {backgroundColor: '#5af'}
	};

	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			realm: new Realm({
				schema: [Barang, Stok, Transaksi, BarangTransaksi],
				schemaVersion: 4
			}),
			isReady: true
		};

		// //Make a realm object synced with the server
		// Realm.Sync.User.login(RealmConfigs.SERVER_ADDRESS, 'maria.setiawati0801@gmail.com', 'palasari',
		// 	(error, user) => {
		// 		if (!error) {
		// 			let realm = new Realm({
		// 				sync: {
		// 					url: RealmConfigs.SYNC_URL,
		// 					user: user
		// 				},
		// 				schema: [Barang, Stok],
		// 				schemaVersion: RealmConfigs.SCHEMA_VERSION
		// 			});
		// 			this.onDatabaseReady(realm);
		// 		} else {
		// 			this.onDatabaseError(error);
		// 		}
		// 	}
		// );
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
			<View style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}>
				
				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<MenuCard 
						cardStyle={{flex: 0.475}}
						icon={<Icon name="list" style={{color: '#0af', fontSize: 64}}/>}
						titleColor="grey"
						title="Daftar Barang"
						onPress={() => navigate('ItemSearch', {realm: this.state.realm})}
					/>
					<View style={{flex: 0.05}} />
					<MenuCard 
						cardStyle={{flex: 0.475}}
						icon={<Icon name="plus" style={{color: 'limegreen', fontSize: 64}}/>}
						titleColor="grey"
						title="Barang Baru"
						onPress={() => navigate('AddItem', {realm: this.state.realm})}
					/>
				</View>

				<View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'center'}}>
					<View style={{flex: 0.225}}/>
					<MenuCard 
						cardStyle={{flex: 0.5}}
						icon={<Icon name="cubes" style={{color: '#800', fontSize: 64}}/>}
						titleColor="grey"
						title="Stok dan Kadaluarsa"
						onPress={() => navigate('StockReport', {realm: this.state.realm})}
					/>
					<View style={{flex: 0.225}} />
				</View>

				<View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-between'}}>
					<MenuCard 
						cardStyle={{flex: 0.475}}
						icon={<Icon name="cart-plus" style={{color: '#f92', fontSize: 64}}/>}
						titleColor="grey"
						title="Transaksi Baru"
						onPress={() => navigate('AddTransaction', {realm: this.state.realm})}
					/>
					<View style={{flex: 0.05}} />
					<MenuCard 
						cardStyle={{flex: 0.475}}
						icon={<Icon name="list-alt" style={{color: '#f49', fontSize: 64}}/>}
						titleColor="grey"
						title="Laporan Transaksi"
						onPress={() => navigate('TransactionReport', {realm: this.state.realm})}
					/>
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
	AddItem: {screen: AddItemScreen},
	StockReport: {screen: StockReportScreen},
	AddTransaction: {screen: AddTransactionScreen},
	TransactionReport: {screen: TransactionReportScreen}
});

AppRegistry.registerComponent("reactNative", () => App);