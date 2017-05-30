import React, {Component} from 'react';
import {View, Text, ListView, ToastAndroid, ActivityIndicator,
        StyleSheet, ScrollView, Dimensions} from 'react-native';
import ItemInfo, {ItemInfoTypes}  from './item-info.js';

export default class TransactionReportScreen extends Component {

    static navigationOptions= {
        headerTitle: 'Laporan Transaksi',
        headerStyle: {
            backgroundColor: '#5af'
        },
        headerTitleStyle: {
            color: 'white'
        },
        headerTintColor: 'white'
    }
    
    constructor(props) {
        super(props);
        let currentDate = new Date();
        this.state = {
            dateStart: new Date(currentDate.getFullYear(), currentDate.getMonth()-1, currentDate.getDate()),
            dateEnd: currentDate,
            transactionListDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
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
        let dateSelector = 
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                
                <View style={{flex: 0.46}}>
                <ItemInfo fieldStyle={style.dateInputField} titleStyle={style.dateInputTitle} type={ItemInfoTypes.DATE} value={this.state.dateStart} editMode={true} name="Dari"
                    onChange={(value) => {this.setState({dateStart: value})}}
                />
                </View>
                <View style={{flex: 0.08, alignItems: 'center', paddingTop: 35}}>
                    <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>-</Text>
                </View>
                <View style={{flex: 0.46}}>
                <ItemInfo fieldStyle={style.dateInputField} titleStyle={style.dateInputTitle} type={ItemInfoTypes.DATE} value={this.state.dateEnd} editMode={true} name="Hingga"
                    onChange={(value) => {this.setState({dateEnd: value})}}
                />
                </View>
            </View>
        

        let transactions = false;
        let itemsSold = false;
        let grandTotal = 0;
        if (this.state.transactions) {
            //filter transaksi sesuai dengan tanggal yang dipilih
            transactions = this.state.transactions.filtered(
                'waktu >= $0 and waktu <= $1', 
                this.state.dateStart, 
                new Date(this.state.dateEnd.getTime() + 24*60*60*1000)
            );
            
            //kelompokkan barang-barang transaksi berdasarkan nama barang
            //untuk masing-masing nama barang dibuat sebuah objek berisi nama, jumlah, dan total harga
            let itemsSoldMap = new Map();
            transactions.forEach((t) => {
                t.transaksi.forEach((barangTransaksi) => {
                    let {nama, harga, jumlah} = barangTransaksi;
                    if (!itemsSoldMap.has(nama)) {
                        itemsSoldMap.set(nama, {
                            nama: barangTransaksi.nama,
                            jumlah: 0,
                            total: 0
                        });
                    }
                    let item = itemsSoldMap.get(nama);
                    item.jumlah += jumlah;
                    grandTotal += item.total += jumlah * harga;
                });
            });

            itemsSold = [];
            itemsSoldMap.forEach((value) => {
                itemsSold.push(value);
            })
        }
        
        let transactionListHeader = 
            <View
                style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    elevation: 1,
                    paddingLeft: 5
                }}
            >
                <Text style={{fontWeight: 'bold', fontSize: 18, flex: 0.55}}>Nama</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18, flex: 0.2}}>Jumlah</Text>
                <Text style={{fontWeight: 'bold', fontSize: 18, flex: 0.25}}>Total</Text>
            </View>

        let transactionList = itemsSold ? 
            <ListView
                dataSource={this.state.transactionListDataSource.cloneWithRows(itemsSold)}
                renderRow={(item) => { return (
                    <View
                        style = {{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#fafafa',
                            borderBottomColor: '#eee',
                            borderBottomWidth: 1,
                            elevation: 1,
                            paddingLeft: 5,
                            paddingTop: 5,
                            paddingBottom: 5
                        }}
                    >
                        <Text style={{fontSize: 16, flex: 0.55}}>{item.nama}</Text>
                        <Text style={{fontSize: 16, flex: 0.2}}>{item.jumlah}</Text>
                        <Text style={{fontSize: 16, flex: 0.25}}>{item.total}</Text>
                    </View>
                )}}
                
            />
        : 
            <View><ActivityIndicator/></View>

        return (
            <View style={{height: Dimensions.get('window').height-80}}>
                <View style={{height: 85, paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, backgroundColor: '#6bf'}}>
                    {dateSelector}
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 0.9}}>
                        {transactionListHeader}
                        <ScrollView>
                        {transactionList}
                        </ScrollView>
                    </View>
                    <View style={{flex: 0.1, backgroundColor: '#49f', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>{"Total:      " + grandTotal}</Text>
                    </View>
                </View>
            </View>
        );
    };
}

const style = StyleSheet.create({
    dateInputTitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    },
    dateInputField: {
        height: 40, 
        padding: 5, 
        fontSize: 16,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#936',
        paddingTop: 10
    }
})