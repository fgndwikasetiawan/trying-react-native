import React, { Component } from 'react';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import { TouchableOpacity, StyleSheet, View, Text, ToastAndroid } from 'react-native';

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
                harga: ''
            },
            realm: this.props.navigation.state.params.realm
        };
    }

    handleValueChange(property, value) {
        let newItemInfo = {
            nama: this.state.itemInfo.nama,
            harga: this.state.itemInfo.harga
        }
        newItemInfo[property] = value;
        this.setState({
            itemInfo: newItemInfo
        })
    }

    saveItem() {
        try {
            this.state.realm.write(() =>
                {   
                    this.state.realm.create('Barang', {nama: this.state.itemInfo.nama, harga: Number(this.state.itemInfo.harga)})
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
                harga: ''
            }
        });
    }

    render() {
        return(
        <View style={{paddingTop: 10}}>
            <ItemInfo name="Nama" value={this.state.itemInfo.nama} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("nama", value)}/>
            <ItemInfo name="Harga" value={this.state.itemInfo.harga} type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("harga", value)}/>
            <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity style={[style.button, {backgroundColor: '#49f', marginRight: 5}]} onPress={() => this.saveItem()}>
                    <Text style={[style.buttonText, {color: 'white'}]}>SIMPAN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button, {backgroundColor: 'grey', marginRight: 5}]} onPress={() => this.reset()}>
                    <Text style={[style.buttonText, {color: 'white'}]}>BATALKAN</Text>
                </TouchableOpacity>
            </View>
        </View>
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