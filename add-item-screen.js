import React, { Component } from 'react';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import { TouchableOpacity, StyleSheet, View, Text, ToastAndroid, ScrollView, Dimensions } from 'react-native';
import { DeleteCircleButton, AddCircleButton } from './buttons.js';

export default class AddItemScreen extends Component {

    static navigationOptions = {
        title: 'Tambah barang',
        headerStyle: {
            backgroundColor: '#5af'
        },
        headerTextStyle: {
            color: 'white'
        },
        headerTintColor: 'white'
    }

    constructor(props) {
        super(props);
        this.state = {
            itemInfo: {
                nama: '',
                harga: '',
                stok: []
            },
            realm: this.props.navigation.state.params.realm
        };
    }

    handleValueChange(property, value, index) {
        let newItemInfo = {
            nama: this.state.itemInfo.nama,
            harga: this.state.itemInfo.harga,
            stok: this.state.itemInfo.stok.slice()
        }

        if (Number(index) !== NaN) {
            newItemInfo.stok[index][property] = value;
            ToastAndroid.show(newItemInfo.stok[index]['kadaluarsa'], ToastAndroid.SHORT);
        }
        else {
            newItemInfo[property] = value;
        }
        this.setState({
            itemInfo: newItemInfo
        })
    }

    saveItem() {
        try {
            this.state.realm.write(() =>
                {   
                    this.state.realm.create('Barang', {nama: this.state.itemInfo.nama, harga: Number(this.state.itemInfo.harga), stok: this.state.itemInfo.stok});
                }
            );    
            ToastAndroid.show('data ' + this.state.itemInfo.nama + ' berhasil disimpan', 5);
            this.reset();
        } catch (error) {
            if (error.toString().endsWith(' existing primary key value.')) {
                ToastAndroid.show('penyimpanan gagal: data ' + this.state.itemInfo.nama + ' sudah ada dalam database', 10);
            }
        }
    }

    reset() {
        this.setState({
            itemInfo: {
                nama: '',
                harga: '',
                stok: []
            }
        });
    }

    deleteStokRow(index) {
        index = index - 1;
        let oldStok = this.state.itemInfo.stok;
        let stok = oldStok.slice(0,index).concat(oldStok.slice(index+1));
        this.setState({
            itemInfo: {
                nama: this.state.itemInfo.nama,
                harga: this.state.itemInfo.harga,
                stok: stok
            }
        });
    }

    addStokRow() {
        let stok = this.state.itemInfo.stok.slice();
        stok.push({stok: 0});
        this.setState({
            itemInfo: {
                nama: this.state.itemInfo.nama,
                harga: this.state.itemInfo.harga,
                stok: stok
            }
        });
    }

    render() {
        let rows = [];
        for (i=0; i<this.state.itemInfo.stok.length; i++) {
            rows.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    <View style={{width: "60%"}}>
                        <ItemInfo name="Tgl. Kadaluarsa" value={this.state.itemInfo.stok[i].kadaluarsa} 
                                  type={ItemInfoTypes.DATE} editMode={true}
                                  onChange={(value) => this.handleValueChange('kadaluarsa', value, i-1)}/>
                    </View>
                    <View style={{width: "30%"}}>
                        <ItemInfo name="Stok" value={this.state.itemInfo.stok[i].stok}
                                  type={ItemInfoTypes.TEXT} editMode={true}
                                  onChange={(value) => this.handleValueChange('stok', value, i-1)}/>
                    </View>
                    <DeleteCircleButton onPress={() => this.deleteStokRow(i)} />
                </View>
            );
        }
        return(
        <ScrollView>
            <View style={{paddingTop: 10, paddingBottom: 30}}>
                <ItemInfo name={typeof this.state.itemInfo.stok.length} value={this.state.itemInfo.nama} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("nama", value)}/>
                <ItemInfo name="Harga" value={this.state.itemInfo.harga} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("harga", value)}/>
                
                <Text style={{color: "grey", fontWeight: "bold", fontSize: 20, marginBottom: 20}}>Stok: </Text>

                {rows}

                <View style={{marginLeft: 50}}>
                    <AddCircleButton scale={2} onPress={() => this.addStokRow()} />
                </View>

                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <TouchableOpacity style={[style.button, {backgroundColor: '#49f', marginRight: 5}]} onPress={() => this.saveItem()}>
                        <Text style={[style.buttonText, {color: 'white'}]}>SIMPAN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.button, {backgroundColor: 'grey', marginRight: 5}]} onPress={() => this.reset()}>
                        <Text style={[style.buttonText, {color: 'white'}]}>BATALKAN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    button: { 
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
		marginTop: 10,
		borderRadius: 5, 
		backgroundColor: "#5af", 
		justifyContent: "center", 
		alignItems: "center",
		elevation: 5
	},
    buttonText: {
        fontWeight: 'bold'
    }
})