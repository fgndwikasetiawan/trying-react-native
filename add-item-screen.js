import React, { Component } from 'react';
import ItemInfo, { ItemInfoTypes } from './item-info.js';
import { TouchableOpacity, StyleSheet, View, Text} from 'react-native';

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

    handleValueChange(property, value) {

    }

    render() {
        return(
        <View style={{paddingTop: 10}}>
            <ItemInfo name="Nama"  type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("nama", value)}/>
            <ItemInfo name="Harga" type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("harga", value)}/>
            <ItemInfo name="Stok" type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("stok", value)}/>
            <ItemInfo name="Kadaluarsa" type={ItemInfoTypes.TEXT} editMode={true} onChange={(value) => this.handleValueChange("kadaluarsa", value)}/>
            <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity style={[style.button, {backgroundColor: '#49f', marginRight: 5}]}>
                    <Text style={[style.buttonText, {color: 'white'}]}>SIMPAN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.button, {backgroundColor: 'grey', marginRight: 5}]}>
                    <Text style={[style.buttonText, {color: 'white'}]}>BATALKAN</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}

const style = StyleSheet.create({
    button: { 
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
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