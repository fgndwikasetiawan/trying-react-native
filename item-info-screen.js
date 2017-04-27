import React, { Component } from 'react';
import { View, Button, StyleSheet, BackAndroid } from 'react-native';
import ItemInfo, { ItemInfoTypes } from './item-info.js';

export default class ItemInfoScreen extends Component {
    static navigationOptions = {
        title: "Item Info",
        headerStyle: {backgroundColor: "#5af"},
        headerTitleStyle: {color: "white"},
        headerTintColor: "white"
    }

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            itemInfo: {
                nama: this.props.item.nama,
                harga: this.props.item.harga,
                stok: this.props.item.stok,
                kadaluarsa: this.props.item.kadaluarsa
            },
            editedItemInfo: {
                nama: this.props.item.nama,
                harga: this.props.item.harga,
                stok: this.props.item.stok,
                kadaluarsa: this.props.item.kadaluarsa
            } 
        };
    }

    handleValueChange(property, value) {
        let newItemInfo = {
            nama: this.state.itemInfo.nama,
            harga: this.state.itemInfo.harga,
            stok: this.state.itemInfo.stok,
            kadaluarsa: this.state.itemInfo.kadaluarsa
        }
        if (property === "nama") {
            newItemInfo.nama = value;
        }
        else if (property === "harga") {
            newItemInfo.harga = value;
        }
        else if (property === "stok") {
            newItemInfo.stok = value;
        }
        else if (property === "kadaluarsa") {
            newItemInfo.kadaluarsa = value;
        }
        this.setState({editedItemInfo: newItemInfo});
    }

    onEditButtonPress() {
        this.setState({
            editedItemInfo: {
                nama: this.state.itemInfo.nama,
                harga: this.state.itemInfo.harga,
                stok: this.state.itemInfo.stok,
                kadaluarsa: this.state.itemInfo.kadaluarsa
            }
        });
    }

    onSaveButtonPress() {
        this.setState({
            itemInfo: {
                nama: this.state.editedItemInfo.nama,
                harga: Number(this.state.editedItemInfo.harga),
                stok: Number(this.state.editedItemInfo.stok),
                kadaluarsa: this.state.editedItemInfo.kadaluarsa
            }
        });
    }

    render() {
        let displayedInfo = this.state.isEditing ? this.state.editedItemInfo : this.state.itemInfo; 
        return (
            <View style={{paddingTop: 10}}>
                
                <ItemInfo name="Nama" value={displayedInfo.nama} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("nama", value)}/>
                <ItemInfo name="Harga" value={displayedInfo.harga.toString()} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("harga", value)}/>
                <ItemInfo name="Stok" value={displayedInfo.stok.toString()} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("stok", value)}/>
                <ItemInfo name="Kadaluarsa" value={displayedInfo.kadaluarsa} type={ItemInfoTypes.TEXT} editMode={this.state.isEditing} onChange={(value) => this.handleValueChange("kadaluarsa", value)}/>

                {
                    this.state.isEditing ? 
                        <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                            <View style={{width: "30%", paddingRight: 10}}>
                                <Button title="Simpan" onPress={() => {this.onSaveButtonPress(); this.setState({isEditing: false})}}/>
                            </View>
                            <View style={{width: "30%"}}>
                                <Button title="Batalkan" color="grey" onPress={() => {this.setState({isEditing: false})} }/>
                            </View>
                        </View> 
                    :
                        <View style={{padding: 10, flexDirection: "row", justifyContent: "flex-end"}}>
                            <View style={{width: "30%"}}>
                                <Button title="Edit" style={{flex: 0.5, height: "100%"}} onPress={() => {this.onEditButtonPress(); this.setState({isEditing: true})}} />
                            </View>
                        </View>
                }
            </View>
        );
    }
}