import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, DatePickerAndroid } from 'react-native';

export const ItemInfoTypes = {
    TEXT: 't',
    DATE: 'd',
    NUMBER: 'n'
};

export default class ItemInfo extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        let field = <Text>???</Text>
        if (this.props.editMode) {
            if (this.props.type === ItemInfoTypes.TEXT) {
                field = <TextInput 
                            style={[style.field, style.inputField, this.props.style]}
                            value={this.props.value.toString()} 
                            onChangeText={(text) => this.props.onChange(text)}
                        />
            }
            else if (this.props.type === ItemInfoTypes.DATE) {
                let toDisplay;
                let value = this.props.value;
                //verify the value is a Date object
                if (value && value.getTime && value.getTime() > (new Date()).getTime()) {
                    const month = (value.getMonth() < 10 ? '0' : '') + value.getMonth();
                    const date = (value.getDate() < 10 ? '0' : '') + value.getDate();
                    toDisplay = value.getFullYear() + '-' + month + '-' + date;
                } else {
                    toDisplay = '(pilih tanggal)';
                }
                field = <TouchableOpacity onPress={
                        () => {
                            DatePickerAndroid.open({date: new Date()}).then((result) => {
                                if (result.action !== DatePickerAndroid.dismissedAction) {
                                    this.props.onChange(new Date(result.year, result.month, result.day));
                                }
                            });
                        }
                    }>
                    <Text style={[style.field, style.inputField, {paddingTop:15, paddingBottom: 4, paddingBottom: 10}]}>{toDisplay}</Text>
                </TouchableOpacity>
            }
        }
        else {
            if (this.props.type === ItemInfoTypes.TEXT) {
                field = <Text style={[style.field, this.props.style]}>{this.props.value}</Text>
            }
            else if (this.props.type == ItemInfoTypes.DATE) {
                let toDisplay;
                let value = this.props.value;
                //verify the value is a Date object
                if (value && value.getTime && value.getTime() > (new Date()).getTime()) {
                    toDisplay = value.getFullYear() + '-' + value.getMonth() + '-' + value.getDate();
                } else {
                    toDisplay = 'tidak ada';
                }
                field = <Text style={[style.field, this.props.style]}>{toDisplay}</Text>
            }
        }
        return (
            <View>
                <Text style={[style.fieldTitle]}>{this.props.name}</Text>
                {field}
            </View>
        );
    }
}


const style = StyleSheet.create({
    fieldTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    field: {
        fontSize: 20,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 10
    },
    inputField: {
        backgroundColor: 'white',
        borderRadius: 10
    }
});