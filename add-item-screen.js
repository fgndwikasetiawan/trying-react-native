import React, { Component } from 'react';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import { TouchableOpacity, StyleSheet, View, Text, ToastAndroid, ScrollView, Dimensions } from 'react-native';
import { Button, DeleteCircleButton, AddCircleButton } from './buttons.js';

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

        if (!isNaN(Number(index))) {
            newItemInfo.stok[index][property] = value;
        }
        else {
            newItemInfo[property] = value;
        }
        this.setState({
            itemInfo: newItemInfo
        });
    }

    saveItem() {
        let stok = this.state.itemInfo.stok.map((stokInfo) => {
            let s = Number(stokInfo.stok);
            s = isNaN(s) ? 0 : s;
            return {kadaluarsa: stokInfo.kadaluarsa, stok: s};
        })
        try {
            this.state.realm.write(() =>
                {   
                    this.state.realm.create('Barang', {_id: (new Date()).toISOString(), nama: this.state.itemInfo.nama, harga: Number(this.state.itemInfo.harga), stok: stok});
                }
            );    
            ToastAndroid.show('data ' + this.state.itemInfo.nama + ' berhasil disimpan', 5);
            this.reset();
        } catch (error) {
            ToastAndroid.show(error.toString(), 10);
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
        for (let i=0; i<this.state.itemInfo.stok.length; i++) {
            rows.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    <View style={{width: "60%"}}>
                        <ItemInfo name="Tgl. Kadaluarsa" value={this.state.itemInfo.stok[i].kadaluarsa} 
                                  type={ItemInfoTypes.DATE} editMode={true}
                                  onChange={(value) => this.handleValueChange('kadaluarsa', value, i)}/>
                    </View>
                    <View style={{width: "30%"}}>
                        <ItemInfo name="Stok" value={this.state.itemInfo.stok[i].stok}
                                  type={ItemInfoTypes.TEXT} editMode={true}
                                  onChange={(value) => this.handleValueChange('stok', value, i)}/>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 5}}>
                        <DeleteCircleButton onPress={() => this.deleteStokRow(i)} />
                    </View>
                </View>
            );
        }
        return(
        <ScrollView>
            <View style={{paddingTop: 10, paddingBottom: 30}}>
                <ItemInfo name="Nama" value={this.state.itemInfo.nama} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("nama", value)}/>
                <ItemInfo name="Harga" value={this.state.itemInfo.harga} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("harga", value)}/>
                
                <Text style={{color: "grey", fontWeight: "bold", fontSize: 20, marginBottom: 20}}>Stok: </Text>

                {rows}

                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                    <AddCircleButton scale={2} onPress={() => this.addStokRow()} />
                </View>

                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <Button color='#49f' style={{marginRight: 5}} title='simpan' onPress={() => this.saveItem()}/>
                    <Button color='grey' style={{marginRight: 5}} title='batalkan' onPress={() => this.reset()} />
                </View>
            </View>
        </ScrollView>
        );
    }
}