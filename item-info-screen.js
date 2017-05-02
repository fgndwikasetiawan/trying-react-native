import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, ToastAndroid } from 'react-native';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import {Button, AddCircleButton, DeleteCircleButton} from './buttons.js';

export default class ItemInfoScreen extends Component {
    static navigationOptions = {
        title: "Item Info",
        headerStyle: {backgroundColor: "#5af"},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white"
    }

    constructor(props) {
        super(props);
        let navigationStates = this.props.navigation.state.params;
        this.state = {
            isEditing: false,
            item: navigationStates.item,
            editedItemInfo: {
                nama: navigationStates.item.nama,
                harga: navigationStates.item.harga,
                stok: navigationStates.item.stok.slice()
            } 
        };
    }

    handleValueChange(property, value, index) {
        // let updatedItemInfo = {
        //     nama: 'asdasd',
        //     harga: 5000,
        //     stok: [{kadaluarsa: new Date(), stok: 10}]
        // }
        let updatedItemInfo = {
            nama: this.state.editedItemInfo.nama,
            harga: this.state.editedItemInfo.harga,
            stok: this.state.editedItemInfo.stok.map((stokInfo) => {return {kadaluarsa: stokInfo.kadaluarsa, stok: stokInfo.stok}})
        }
        if (!isNaN(Number(index))) {
            ToastAndroid.show(index + ', ' + property + ', ' + value, 10);
            updatedItemInfo.stok[index][property] = value;
        }
        else {
            updatedItemInfo[property] = value;
        }
        this.setState({
            editedItemInfo: updatedItemInfo
        });
    }

    onEditButtonPress() {
        this.setState({
            editedItemInfo: {
                nama: this.state.item.nama,
                harga: this.state.item.harga,
                stok: this.state.item.stok.slice()
            },
            isEditing: true
        });
    }

    onSaveButtonPress() {
        let realm = this.props.navigation.state.params.realm;
        let item = this.state.item;
        realm.write(() => {
            item.nama = this.state.editedItemInfo.nama;
            item.harga = this.state.editedItemInfo.harga;
            for (let i=0; i<item.stok; i++) {
                realm.delete(item.stok[i]);
            }
            item.stok = this.state.editedItemInfo.stok.map((stokInfo) => {
                let s = Number(stokInfo.stok);
                s = isNaN(s) ? 0 : s;
                return {kadaluarsa: stokInfo.kadaluarsa, stok: s};
            });
        });

        this.setState({
            item: item,
            isEditing: false
        });
    }

    addStokRow() {
        let stok = this.state.editedItemInfo.stok.slice();
        stok.push({stok: 0});
        let updatedItemInfo = this.state.editedItemInfo;
        updatedItemInfo.stok = stok;
        this.setState({
            editedItemInfo: updatedItemInfo
        });
    }

    deleteStokRow(index) {
        let oldStok = this.state.editedItemInfo.stok;
        let stok = oldStok.slice(0,index).concat(oldStok.slice(index+1));
        let updatedItemInfo = this.state.editedItemInfo;
        updatedItemInfo.stok = stok;
        this.setState({
            editedItemInfo: updatedItemInfo
        });
    }

    render() {
        let displayedInfo = this.state.isEditing ? this.state.editedItemInfo : this.state.item; 
        let rows = [];
        for (let i=0; i<displayedInfo.stok.length; i++) {
            rows.push(
                <View key={i} style={{flexDirection: 'row'}}>
                    <View style={{width: "60%"}}>
                        <ItemInfo name="Tgl. Kadaluarsa" value={displayedInfo.stok[i].kadaluarsa} 
                                  type={ItemInfoTypes.DATE} editMode={this.state.isEditing}
                                  onChange={(value) => this.handleValueChange('kadaluarsa', value, i)}/>
                    </View>
                    <View style={{width: "30%"}}>
                        <ItemInfo name="Stok" value={displayedInfo.stok[i].stok}
                                  type={ItemInfoTypes.TEXT} editMode={this.state.isEditing}
                                  onChange={(value) => this.handleValueChange('stok', value, i)}/>
                    </View>
                    {this.state.isEditing ? 
                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 5}}>
                            <DeleteCircleButton onPress={() => this.deleteStokRow(i)}/> 
                        </View>
                    : false}
                </View>
            );
        }

        return (
            <ScrollView>
                <View style={{paddingTop: 10}}>
                    
                    <ItemInfo name="Nama" value={displayedInfo.nama} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("nama", value)}/>
                    <ItemInfo name="Harga" value={displayedInfo.harga.toString()} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("harga", value)}/>

                    <Text style={{color: "grey", fontWeight: "bold", fontSize: 20, marginBottom: 20}}>Stok: </Text>

                    {rows}
                    
                    {this.state.isEditing ? 
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                            <AddCircleButton scale={2} onPress={() => this.addStokRow()} />
                        </View> : false
                    }

                    {
                        this.state.isEditing ? 
                            <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                <View style={{width: "30%", paddingRight: 10}}>
                                    <Button title="Simpan" onPress={() => this.onSaveButtonPress()}/>
                                </View>
                                <View style={{width: "30%"}}>
                                    <Button title="Batalkan" color="grey" onPress={() => {this.setState({isEditing: false})} }/>
                                </View>
                            </View> 
                        :
                            <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end"}}>
                                <View style={{width: "30%"}}>
                                    <Button title="Edit" style={{flex: 0.5, height: "100%"}} onPress={() => this.onEditButtonPress()} />
                                </View>
                            </View>
                    }
                </View>
            </ScrollView>
        );
    }
}