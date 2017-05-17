import React, {Component} from 'react';
import {View, ScrollView, Text, TouchableNativeFeedback, TouchableOpacity, 
        TextInput, ListView, ToastAndroid, Animated, Dimensions, StyleSheet,
        BackAndroid} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import ItemInfo, {ItemInfoTypes} from './item-info.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AddCircleButton, DeleteCircleButton, Button} from './buttons.js'
import {getDateString} from './utils.js';

const ModalType = {
    ITEM_PICKER: 'ip',
    EMPTY: ''
}

function PopupModalAnimated(props) {
    let animationValue = props.animationValue;
    let windowDimensions = Dimensions.get('window');
    let modalDimensions = {width: windowDimensions.width, height: windowDimensions.height - 60};
    return (
        props.visible ?
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']
                }),
                height: modalDimensions.height,
                width: modalDimensions.width
            }}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [props.startingTop, 0]
                    }),
                    left: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [props.startingLeft, 0],
                    }),
                    height: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, modalDimensions.height],
                    }),
                    width: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, modalDimensions.width]
                    }),
                    paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20
                }}>
                {props.children}
            </Animated.View>
        </Animated.View>
        :
        false
    );
}

function ItemPicker(props) {
    return (
        <View style={[style.itemPickerContainer, {alignItems: 'center', alignSelf: 'center'}]}>
            <TextInput style={style.itemPickerInput}
                underlineColorAndroid='transparent'
                autoFocus={true}
                value={props.query}
                onChangeText={props.onChangeText}/>
            <ListView style={{width: '100%', marginTop: 10}}
                dataSource={props.dataSource.cloneWithRows(
                    props.items.filter((itemStok) => itemStok.item.nama.toLowerCase().contains(props.query.toLowerCase()))
                )}
                renderRow={(itemStok) => 
                    <TouchableOpacity style={style.itemPickerRow}
                        onPress={() => props.onPress(itemStok)}>
                        <Text>
                            <Text style={{fontWeight: 'bold', color: 'maroon'}}>
                                {'(' + getDateString(itemStok.stok.kadaluarsa) + ') '}
                            </Text>
                            {itemStok.item.nama}
                        </Text>
                    </TouchableOpacity>
                }/>
        </View>
    );
}

function TransactionItem(props) {
    return (
        <View style={props.style}>
        <View style={style.transactionItemUpperRow}>
            <View style={style.transactionItemName} 
                onStartShouldSetResponder={() => true}
                onResponderGrant={
                    ({nativeEvent}) => {
                        props.showModal(nativeEvent.pageX, nativeEvent.pageY);
                    }
                }>
                 
                    <Text>{(props.itemTransaksi.stok.kadaluarsa ? 
                        '(' + getDateString(props.itemTransaksi.stok.kadaluarsa) + ') ' : '') + props.itemTransaksi.item.nama}</Text>
            </View>
            
            <Icon style={style.transactionItemSymbol} name="times"/>
            <TextInput underlineColorAndroid='transparent' style={style.transactionItemQty} value={props.itemTransaksi.jumlah || ""}
                onChangeText={(text) => props.onChange('jumlah', text)}
            />
        </View>
        <View style={style.transactionItemLowerRow}>
            <Text style={style.transactionItemPrice}>{props.itemTransaksi.item.harga || "- -"}</Text>
            <Text style={style.transactionItemTotalPrice}>{props.itemTransaksi.jumlah * props.itemTransaksi.item.harga || "- -"}</Text>
        </View>
        </View>
    );
}


export default class AddTransactionScreen extends Component {
    static navigationOptions = {
        title: 'Transaksi baru',
        headerStyle: {backgroundColor: '#5af'},
        headerTitleStyle: {color: 'white', fontWeight: 'bold'},
        headerTintColor: 'white'
    }

    constructor(props) {
        super(props);
        this.state = {
            pelanggan: "",
            tanggal: new Date(),
            items: [],
            transactionItems: [],
            newTransactionItem: {item:{nama: ''}, stok: {}},
            itemPickerDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            itemPickerQuery: '',
            editedItem: false,
            modalAnimation: new Animated.Value(0),
            modalStartingTop: 0,
            modalStartingLeft: 0,
            showModal: false,
            modalType: ModalType.EMPTY,
        }
        BackAndroid.addEventListener("hardwareBackPress", () => {
            if (this.state.showModal) {
                this.hideModal();
                return true;
            }
        })
    }

    componentDidMount() {
        this.fetchItems();
    }

    fetchItems() {
        let realm = this.props.navigation.state.params.realm;
        let itemsPromise = new Promise((resolve, reject) => {
            try {
                let items = realm.objects('Barang');
                resolve(items);
            }
            catch (error) {
                reject(error);
            }
        });
        itemsPromise.then((items) => {
            let itemStocks = items.map((item) => {
                return item.stok.map((stokInfo) => {
                    return {item: item, stok: stokInfo}
                });
            }).reduce((i1, i2) => {
                return [].concat(i1, i2);
            });
            this.setState({items: itemStocks});
        }, 
        (error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    }

    addItemRow() {
        let transactionItems = this.state.transactionItems;
        let newTransactionItem = this.state.newTransactionItem;
        transactionItems.push({
            item: newTransactionItem.item,
            stok: newTransactionItem.stok,
            jumlah: newTransactionItem.jumlah,
        });
        newTransactionItem = {item: {nama: ''}, stok: {}, jumlah: ''};
        this.setState({transactionItems, newTransactionItem});
    }

    deleteItemRow(item) {
        let transactionItems = this.state.transactionItems;
        let index = transactionItems.findIndex((transactionItem) => transactionItem === item);
        transactionItems = transactionItems.slice(0, index).concat(transactionItems.slice(index+1));
        this.setState({transactionItems});
    }

    handleItemValueChange(item, prop, value) {
        item[prop] = value;
        this.setState({newTransactionItem: this.state.newTransactionItem})
    }

    showModal(x, y, type) {
        this.setState({
            modalStartingTop: y,
            modalStartingLeft: x,
            modalType: type,
            showModal: true
        });
        Animated.timing(this.state.modalAnimation, {toValue: 1, duration: 800}).start();
    }

    hideModal() {
        this.setState({
            showModal: false,
            modalType: ModalType.EMPTY
        });
        Animated.timing(this.state.modalAnimation, {toValue: 0, duration: 800}).start();
    }

    saveTransaction() {
        // let barangTransaksi = this.state.transactionItems.map(
        //                         (itemTransaksi) => {
        //                             return {nama: itemTransaksi.item.nama, harga: itemTransaksi.item.harga, jumlah: itemTransaksi.jumlah}
        //                         });
        
        //kelompokkan barang transaksi berdasarkan nama
        let barangTransaksiGrouped = {};
        this.state.transactionItems.forEach((itemTransaksi) => {
            let nama = itemTransaksi.item.nama;
            if (!barangTransaksiGrouped[nama]) {
                barangTransaksiGrouped[nama] = {harga: Number(itemTransaksi.item.harga) || 0, jumlah: 0};
            }
            barangTransaksiGrouped[nama].jumlah += Number(itemTransaksi.jumlah) || 0;
        });

        //ubah ke bentuk list (array)
        let listBarangTransaksi = Object.keys(barangTransaksiGrouped)
                                    .map((key) => Object.assign({nama: key}, barangTransaksiGrouped[key]));

        let transaksi = {pelanggan: this.state.pelanggan, waktu: this.state.tanggal, transaksi: listBarangTransaksi}
        try {
            let realm = this.props.navigation.state.params.realm;
            realm.write(() => {
                realm.create('Transaksi', transaksi);
                this.state.transactionItems.forEach((itemTransaksi) => {
                    itemTransaksi.stok.stok -= itemTransaksi.jumlah;
                })
            });
            ToastAndroid.show('Transaksi tersimpan', ToastAndroid.SHORT);
            this.reset();
        }
        catch (error) {
            ToastAndroid.show('Error: ' + error, 10);
        }
    }

    reset() {
        this.setState({
            pelanggan: "",
            tanggal: new Date(),
            items: [],
            transactionItems: [],
            newTransactionItem: {item:{nama: ''}, stok: {}},
            itemPickerDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            itemPickerQuery: '',
            editedItem: false,
            modalAnimation: new Animated.Value(0),
            modalStartingTop: 0,
            modalStartingLeft: 0,
            showModal: false,
            modalType: ModalType.EMPTY
        });
    }

    render() {
        var itemPicker = 
            <ItemPicker 
                items={this.state.items}
                dataSource={this.state.itemPickerDataSource}
                query={this.state.itemPickerQuery}
                onChangeText={(text) => this.setState({itemPickerQuery: text})}
                onPress={(itemStok) => {
                    this.hideModal();
                    this.state.editedItem.item = itemStok.item;
                    this.state.editedItem.stok = itemStok.stok;
                }}
            />

        let modal = 
            <PopupModalAnimated 
                visible={this.state.showModal}
                animationValue={this.state.modalAnimation}
                startingTop={this.state.modalStartingTop}
                startingLeft={this.state.modalStartingLeft}>
                {this.state.modalType === ModalType.ITEM_PICKER ? itemPicker : false}
                <Button title="kembali" style={{backgroundColor: '#800', width: '50%', alignSelf: 'center'}} onPress={() => this.hideModal()} />
            </PopupModalAnimated>;

        let staticData = 
                <View style={{paddingLeft: 5, paddingRight: 5}}>
                    <ItemInfo name="Pelanggan" value={this.state.pelanggan} type={ItemInfoTypes.TEXT} editMode={true} 
                            onChange={(value) => this.setState({pelanggan: value})}
                    />
                    <ItemInfo name="Tanggal" value={this.state.tanggal} type={ItemInfoTypes.DATE} editMode={true} 
                            onChange={(value) => this.setState({tanggal: value})}
                    />
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>Barang:</Text>
                </View>;
        
        let transactionItemsHeader = 
                <View style={{
                    flex: 1, flexDirection: 'row', justifyContent: 'space-between', height: 25,
                    paddingLeft: 10, paddingRight: 5
                }}>   
                    <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontWeight: 'bold', flex: 0.6}}>Nama</Text>
                        <View style={{flex: 0.1}} />
                        <Text style={{fontWeight: 'bold', flex: 0.2}}>Jumlah</Text>
                    </View>
                    <View style={{flex: 0.1}} />
                </View>;

        let transactionItems = this.state.transactionItems.map((itemTransaksi, index) => {
            return (
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TransactionItem style={{flex: 0.9}}
                        itemTransaksi={itemTransaksi}
                        onChange={(prop, value) => this.handleItemValueChange(itemTransaksi, prop, value)}
                        showModal={(x, y) => {
                            this.setState({
                                editedItem: itemTransaksi,
                                itemPickerQuery: itemTransaksi.item.nama
                            });
                            this.showModal(x, y, ModalType.ITEM_PICKER);
                        }}
                    />
                    <View style={{flex: 0.1, alignItems: 'center', paddingTop: 5}}>
                        <DeleteCircleButton onPress={() => this.deleteItemRow(itemTransaksi)}/>
                    </View>
                </View>
            );  
        });
        let newTransactionItemFields =
                <View style={{paddingLeft: 10, paddingRight: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TransactionItem style={{flex: 0.9}} 
                        itemTransaksi={this.state.newTransactionItem}
                        onChange={(prop, value) => this.handleItemValueChange(this.state.newTransactionItem, prop, value)}
                        showModal={(x, y) => {
                            this.setState({
                                editedItem: this.state.newTransactionItem,
                                itemPickerQuery: this.state.newTransactionItem.item.nama
                            });
                            this.showModal(x, y, ModalType.ITEM_PICKER);
                        }}
                        />
                    <View style={{flex: 0.1}}/>
                </View>;

        let addButton =                
                <View style={{paddingBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <AddCircleButton scale={2} onPress={() => this.addItemRow()}/>
                </View>;

            
        let totalCost = 
                <View style={{marginTop: 20, paddingLeft: 10, paddingRight: 30, flexDirection: 'row', justifyContent: 'space-between', height: 60}}>
                    <Text style={{fontSize: 32, fontWeight: 'bold'}}>Total: </Text>
                    <Text style={{fontSize: 32}}>{
                        this.state.transactionItems.reduce((acc, transaksi) => {
                            return (transaksi.item.harga * transaksi.jumlah + acc) || 0;
                        }, 0) 
                    }</Text>
                </View>

        let buttons =
                <View style={{marginTop: 15, marginBottom: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60}}>
                    <Button title="simpan" onPress={() => this.saveTransaction()} />    
                </View>
        
        return(
            <View>
            <ScrollView style={{paddingTop: 5}}>
                {staticData}
                {transactionItemsHeader}
                <View style={{paddingLeft: 10, paddingRight: 5}}>
                    {transactionItems}
                </View>
                {newTransactionItemFields}
                {addButton}
                {totalCost}
                {buttons}
            </ScrollView>
            {modal}
            </View>
        );
    }
}

const style = StyleSheet.create({
    transactionItemUpperRow: {
        height: 40, marginBottom: 5,
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    transactionItemLowerRow: {
        height: 40,
        flex: 1, flexDirection: 'row', justifyContent: 'space-between'
    },
    transactionItemName: {
        height: 40, paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5,
        borderRadius: 5, backgroundColor: 'white',
        flex: 0.6
    },
    transactionItemSymbol: {
        height: 40, fontSize: 16,
        flex: 0.1,
        textAlign: 'center', textAlignVertical: 'center'
    },
    transactionItemQty: {
        height: 40, paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5,
        borderRadius: 5, backgroundColor: 'white',
        flex: 0.2
    },
    transactionItemPrice: {
        height: 40, paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5,
        flex: 0.7
    },
    transactionItemTotalPrice: {
        height: 40, paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5,
        flex: 0.2
    },
    itemPickerContainer: {
        backgroundColor: '#bbb',
        borderRadius: 10,
        width: '90%',
        height: '90%',
        padding: 10
    },
    itemPickerInput: {
        borderRadius: 5,
        backgroundColor: 'white',
        height: 40,
        fontSize: 16,
        width: '100%'
    },
    itemPickerRow: {
        backgroundColor: "white",
        height: 50,
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginRight: 5,
        marginBottom: 2,
        elevation: 1
    }
})