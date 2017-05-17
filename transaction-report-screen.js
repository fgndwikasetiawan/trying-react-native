import React, {Component} from 'react';
import {View, Text, ListView, ToastAndroid, ActivityIndicator} from 'react-native';

export default class TransactionReportScreen extends Component {

    static navigationOptions= {
        headerTitle: 'Laporan Transaksi',
        headerStyle: {
            backgroundColor: '#5af'
        },
        headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold'
        },
        headerTintColor: 'white'
    }
    
    constructor(props) {
        super(props);
        this.state = {
            transactionsListDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
        this.fetchItems();
    }

    fetchItems() {
        let realm = this.props.navigation.state.params.realm;
        let fetchTransactionsPromise = new Promise((resolve, reject) => {
            try {
                let transactions = realm.objects('Transaksi');
                resolve(transactions);
            }
            catch (error) {
                reject(error);
            }
        });
        fetchTransactionsPromise.then((transactions) => {
            this.setState({transactions});
        }, (error) => {
            ToastAndroid.show(error, 10);
        })
    }

    render() {
        let transactions = this.state.transactions;
        let transactionsList = transactions ?
            <ListView 
                dataSource={this.state.transactionsListDataSource.cloneWithRows(transactions)}
                renderRow={(row) => 
                    <View>
                        <Text>{row.waktu.toString()} - {row.transaksi.reduce((a, b) => a + b.jumlah * b.harga, 0).toString()}</Text>
                    </View>
                }
            />:
            <View><ActivityIndicator /></View>
        return (
            <View>
                {transactionsList}
            </View>
        );
    };
}