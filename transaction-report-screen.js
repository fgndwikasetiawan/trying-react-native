import React, {Component} from 'react';
import {View, Text, ListView, ToastAndroid, ActivityIndicator} from 'react-native';
import ItemInfo, {ItemInfoTypes}  from './item-info.js';

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
        let currentDate = new Date();
        this.state = {
            dateStart: new Date(currentDate.getFullYear()-1, currentDate.getMonth(), currentDate.getDate()+1),
            dateEnd: currentDate,
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
        
        let dateSelector = 
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <View style={{flex: 0.46}}>
                <ItemInfo type={ItemInfoTypes.DATE} value={this.state.dateStart} editMode={true} name="Dari"
                    onChange={(value) => {this.setState({dateStart: value})}}
                />
                </View>
                <View style={{flex: 0.08}}/>
                <View style={{flex: 0.46}}>
                <ItemInfo type={ItemInfoTypes.DATE} value={this.state.dateEnd} editMode={true} name="Hingga"
                    onChange={(value) => {this.setState({dateEnd: value})}}
                />
                </View>
            </View>
        
        let transactionsList = transactions ?
            <ListView 
                dataSource={this.state.transactionsListDataSource.cloneWithRows(transactions.filtered(
                    'waktu >= $0 and waktu <= $1', 
                        this.state.dateStart, 
                        new Date(this.state.dateEnd.getTime() + 24*60*60*1000)
                ))}
                renderRow={(row) => 
                    <View>
                        <Text>{row.waktu.toString()} - {row.transaksi.reduce((a, b) => a + b.jumlah * b.harga, 0).toString()}</Text>
                    </View>
                }
            />:
            <View><ActivityIndicator /></View>

        return (
            <View>
                <View style={{height: 100, paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, marginBottom: 10, backgroundColor: '#6bf'}}>
                    {dateSelector}
                </View>
                {transactionsList}
            </View>
        );
    };
}