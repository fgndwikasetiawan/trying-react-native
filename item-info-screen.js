import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, ToastAndroid, Modal } from 'react-native';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import {Button, AddCircleButton, DeleteCircleButton} from './buttons.js';
import {HorizontalBar} from './misc-components.js';
import {NavigationActions} from 'react-navigation';

export default class ItemInfoScreen extends Component {
    static navigationOptions = {
        title: "Data Barang",
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
                stok: navigationStates.item.stok.slice(),
                thresholdKadaluarsa: navigationStates.item.thresholdKadaluarsa,
                thresholdStok: navigationStates.item.thresholdStok
            },
            showDeleteModal: false 
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
            //harus pakai map karena nggak bisa ngedit objek stokInfo secara langsung
            stok: this.state.editedItemInfo.stok.map((stokInfo) => {return {kadaluarsa: stokInfo.kadaluarsa, stok: stokInfo.stok}}),
            thresholdKadaluarsa: this.state.editedItemInfo.thresholdKadaluarsa,
            thresholdStok: this.state.editedItemInfo.thresholdStok
        }
        if (!isNaN(Number(index))) {
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
                stok: this.state.item.stok.slice(),
                thresholdStok: this.state.item.thresholdStok,
                thresholdKadaluarsa: this.state.item.thresholdKadaluarsa
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
            item.thresholdKadaluarsa = Number(this.state.editedItemInfo.thresholdKadaluarsa) || 0;
            item.thresholdStok = Number(this.state.editedItemInfo.thresholdStok) || 0;
        });

        this.setState({
            item: item,
            isEditing: false
        });

        this.props.navigation.state.params.itemSearchScreen.refreshItems();
    }

    onDeleteButtonPress() {
        this.setState({showDeleteModal: true});
    }

    deleteItem() {
        let itemSearchScreen = this.props.navigation.state.params.itemSearchScreen || {clearItems: () => false, refreshItems: () => false};
        itemSearchScreen.clearItems();
        let realm = this.props.navigation.state.params.realm;
        let item = this.state.item;
        this.setState({
            item: {}
        });

        //unset the item param in navigation state so that it won't reference the soon-to-be-gone item object
        this.props.navigation.state.params.item = {};

        realm.write(() => realm.delete(item));
        itemSearchScreen.refreshItems();
        this.props.navigation.goBack();        
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
            <ScrollView style={{paddingLeft: 5}}>
                <View>
                    <Modal animationType="fade"
                            transparent={true}
                            visible={this.state.showDeleteModal}
                            onRequestClose={() => this.setState({showDeleteModal: false})}>
                        <View style={{height: "100%", backgroundColor: "rgba(40, 40, 40, 0.75)", flexDirection: 'column', justifyContent: 'center', paddingTop: 10, paddingLeft: 5, paddingRight: 5, paddingBottom: 20}}>
                            <View style={{backgroundColor: '#eee', borderRadius: 20, paddingTop: 20, paddingLeft: 10, paddingBottom: 40, paddingRight: 10, }}>
                                <Text style={{fontSize: 20, color: 'grey'}}>Perhatian!</Text>
                                <View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 16}}>Yakin ingin menghapus data "{this.state.item.nama}" dari database?</Text>
                                </View>
                                <View style={{marginTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{marginRight: 20}}>
                                    <Button title="   Ya   " onPress={() => {this.setState({showDeleteModal: false}); this.deleteItem()}}/>
                                    </View>
                                    <Button title="Tidak" color="#aaa" onPress={() => this.setState({showDeleteModal: false})}/>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={{paddingTop: 10}}>
                    
                    <ItemInfo name="Nama" value={displayedInfo.nama} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("nama", value)}/>
                    <ItemInfo name="Harga" value={displayedInfo.harga.toString()} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("harga", value)}/>

                    <HorizontalBar />
                    <Text style={{color: "grey", fontWeight: "bold", fontSize: 20, marginBottom: 20}}>Batas Stok / Kadaluarsa </Text>
                    <ItemInfo name="Stok Minimal" value={displayedInfo.thresholdStok} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("thresholdStok", value)}/>
                    <ItemInfo name="Jarak Kadaluarsa Minimal (dalam hari)" value={displayedInfo.thresholdKadaluarsa} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("thresholdKadaluarsa", value)}/>

                    <HorizontalBar />
                    <Text style={{color: "grey", fontWeight: "bold", fontSize: 20, marginBottom: 20}}>Stok</Text>

                    {rows}
                    
                    {this.state.isEditing ? 
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                            <AddCircleButton scale={2} onPress={() => this.addStokRow()} />
                        </View> : false
                    }

                    {
                        this.state.isEditing ? 
                            <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                                <View style={{paddingRight: 10}}>
                                    <Button title="Hapus" onPress={() => this.onDeleteButtonPress()} color="#c00"/>
                                </View>
                                <View style={{paddingRight: 10}}>
                                    <Button title="Simpan" onPress={() => this.onSaveButtonPress()}/>
                                </View>
                                <View>
                                    <Button title="Batalkan" color="grey" onPress={() => {this.setState({isEditing: false})} }/>
                                </View>
                            </View> 
                        :
                            <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end"}}>
                                <View>
                                    <Button title="Edit" style={{flex: 0.5, height: "100%"}} onPress={() => this.onEditButtonPress()} />
                                </View>
                            </View>
                    }
                </View>
            </ScrollView>
        );
    }
}